import type {
  Attempt,
  AttemptQuestion as AttemptQuestionResponse,
  AttemptResult,
  LearnerAnswer,
} from "@shared/schemas";
import type { AttemptStateDependencies } from "@/application/assessment/attempt-dependencies";
import { toAttempt, toAttemptQuestion } from "@/application/assessment/attempt-mapper";
import { makeLoadQuestionView } from "@/application/assessment/question-view";
import type { AssessmentAttempt } from "@/domain/assessment/assessment-attempt";
import type { AttemptAnswer } from "@/domain/assessment/attempt-answer";
import type { AttemptQuestion } from "@/domain/assessment/attempt-question";
import { getAttemptScore, isPassed } from "@/domain/assessment/attempt-score";
import { getMastery, getPoints, getScore } from "@/domain/assessment/elo-rating";
import type { Question } from "@/domain/assessment/question";
import { NotFoundError } from "@/domain/errors";

export type AttemptState = {
  attempt: Attempt;
  question: AttemptQuestionResponse | null;
  result: AttemptResult | null;
};

export const getAnswerPoints = (answer: AttemptAnswer): number =>
  getPoints(answer.difficulty, getScore(answer.isCorrect, answer.hintsUsed));

export const makeLoadAttemptState = (dependencies: AttemptStateDependencies) => {
  const {
    assessmentAttemptRepository,
    attemptQuestionRepository,
    attemptAnswerRepository,
    questionRepository,
    lessonRepository,
    completeLesson,
  } = dependencies;
  const loadView = makeLoadQuestionView(dependencies);

  const finish = async (
    attempt: AssessmentAttempt,
    attemptQuestions: AttemptQuestion[],
    answers: AttemptAnswer[],
  ): Promise<AssessmentAttempt> => {
    const score = getAttemptScore(
      answers.filter((answer) => answer.isCorrect).length,
      attemptQuestions.length,
    );
    const passed = isPassed(score);
    if (passed && attempt.lessonId) {
      await completeLesson({ userId: attempt.userId, lessonId: attempt.lessonId });
    }
    return assessmentAttemptRepository.update(attempt.id, {
      score,
      passed,
      points: answers.reduce((total, answer) => total + getAnswerPoints(answer), 0),
      finishedAt: new Date(),
    });
  };

  const buildResult = async (
    attempt: AssessmentAttempt,
    attemptQuestions: AttemptQuestion[],
    answers: AttemptAnswer[],
  ): Promise<AttemptResult> => {
    const questions = await questionRepository.listByIds(
      attemptQuestions.map((attemptQuestion) => attemptQuestion.questionId),
    );
    const questionById = new Map<string, Question>(
      questions.map((question) => [question.id, question]),
    );
    const answerByQuestionId = new Map(answers.map((answer) => [answer.questionId, answer]));

    const reviews = await Promise.all(
      attemptQuestions.map(async (attemptQuestion) => {
        const answer = answerByQuestionId.get(attemptQuestion.questionId);
        const question = questionById.get(attemptQuestion.questionId);
        if (!answer || !question) {
          throw new NotFoundError("Attempt not found", { attemptId: attempt.id });
        }
        const view = await loadView(attemptQuestion, question);
        const [correctAnswer] = view.accepted;
        return {
          answer,
          question,
          review: {
            questionId: attemptQuestion.id,
            position: attemptQuestion.position,
            prompt: view.prompt,
            tree: view.tree,
            response: answer.response as LearnerAnswer,
            isCorrect: answer.isCorrect,
            correctAnswer: correctAnswer as LearnerAnswer,
            explanation: view.explanation,
            replay: view.replay,
            hintsUsed: answer.hintsUsed,
            points: getAnswerPoints(answer),
          },
        };
      }),
    );

    const reviewLessonIds = [
      ...new Set(
        reviews
          .filter(({ answer }) => !answer.isCorrect)
          .map(({ question }) => question.reviewLessonId),
      ),
    ];
    const reviewLessons = (
      await Promise.all(reviewLessonIds.map((lessonId) => lessonRepository.findById(lessonId)))
    )
      .filter((lesson) => lesson !== null)
      .map((lesson) => ({ id: lesson.id, title: lesson.title }));

    const lessonRatings = new Map<string, { before: number; after: number }>();
    for (const { answer, question } of reviews) {
      const existing = lessonRatings.get(question.lessonId);
      lessonRatings.set(question.lessonId, {
        before: existing?.before ?? answer.ratingBefore,
        after: answer.ratingAfter,
      });
    }
    const averageMastery = (pick: (rating: { before: number; after: number }) => number) => {
      const masteries = [...lessonRatings.values()].map((rating) => getMastery(pick(rating)));
      if (masteries.length === 0) return 0;
      return Math.round(
        (masteries.reduce((total, mastery) => total + mastery, 0) / masteries.length) * 100,
      );
    };

    return {
      score: attempt.score,
      passed: attempt.passed,
      points: attempt.points,
      ratingChange: answers.reduce(
        (total, answer) => total + answer.ratingAfter - answer.ratingBefore,
        0,
      ),
      masteryBefore: averageMastery((rating) => rating.before),
      masteryAfter: averageMastery((rating) => rating.after),
      reviewLessons,
      answers: reviews.map(({ review }) => review),
    };
  };

  return async (attempt: AssessmentAttempt): Promise<AttemptState> => {
    const [attemptQuestions, answers] = await Promise.all([
      attemptQuestionRepository.listByAttemptId(attempt.id),
      attemptAnswerRepository.listByAttemptId(attempt.id),
    ]);
    const answeredQuestionIds = new Set(answers.map((answer) => answer.questionId));
    const current = attemptQuestions.find(
      (attemptQuestion) => !answeredQuestionIds.has(attemptQuestion.questionId),
    );

    if (current) {
      const [question] = await questionRepository.listByIds([current.questionId]);
      if (!question)
        throw new NotFoundError("Question not found", { questionId: current.questionId });
      const view = await loadView(current, question);
      return {
        attempt: toAttempt(attempt, attemptQuestions.length, answers.length),
        question: toAttemptQuestion(current, view),
        result: null,
      };
    }

    const finished = attempt.finishedAt
      ? attempt
      : await finish(attempt, attemptQuestions, answers);
    return {
      attempt: toAttempt(finished, attemptQuestions.length, answers.length),
      question: null,
      result: await buildResult(finished, attemptQuestions, answers),
    };
  };
};

export type LoadAttemptState = ReturnType<typeof makeLoadAttemptState>;
