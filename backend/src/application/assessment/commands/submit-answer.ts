import type {
  IdParam,
  LearnerAnswer,
  SubmitAnswerRequest,
  SubmitAnswerResponse,
} from "@shared/schemas";
import { makeResolveCurrentQuestion } from "@/application/assessment/attempt-access";
import type { AttemptStateDependencies } from "@/application/assessment/attempt-dependencies";
import { getAnswerPoints, makeLoadAttemptState } from "@/application/assessment/attempt-state";
import { gradeAnswer } from "@/application/assessment/grade-answer";
import { makeGetPracticeRating } from "@/application/assessment/practice-rating";
import { makeLoadQuestionView } from "@/application/assessment/question-view";
import { getSignedInUserId } from "@/application/lesson/lesson-access";
import {
  getMastery,
  getNextDifficulty,
  getNextRating,
  getScore,
  startingRating,
} from "@/domain/assessment/elo-rating";
import type { AssessmentAttemptRepository } from "@/domain/assessment/repositories/assessment-attempt-repository";
import type { AttemptAnswerRepository } from "@/domain/assessment/repositories/attempt-answer-repository";
import { BadRequestError, NotFoundError } from "@/domain/errors";
import type { UserMasteryRepository } from "@/domain/user/repositories/user-mastery-repository";

type SubmitAnswerDependencies = AttemptStateDependencies & {
  assessmentAttemptRepository: Pick<AssessmentAttemptRepository, "findById" | "update">;
  attemptAnswerRepository: Pick<
    AttemptAnswerRepository,
    "listByAttemptId" | "countByUserAndLesson" | "recordAnswer"
  >;
  userMasteryRepository: Pick<UserMasteryRepository, "findById">;
};

export const makeSubmitAnswer = (dependencies: SubmitAnswerDependencies) => {
  const resolveCurrentQuestion = makeResolveCurrentQuestion(dependencies);
  const loadAttemptState = makeLoadAttemptState(dependencies);
  const loadView = makeLoadQuestionView(dependencies);
  const getPracticeRating = makeGetPracticeRating(dependencies);
  const { attemptAnswerRepository, questionRepository, userMasteryRepository } = dependencies;

  return async ({
    id,
    questionId,
    answer,
  }: IdParam & SubmitAnswerRequest): Promise<SubmitAnswerResponse> => {
    const userId = getSignedInUserId();
    const { attempt, attemptQuestion } = await resolveCurrentQuestion(id, questionId);
    const [question] = await questionRepository.listByIds([attemptQuestion.questionId]);
    if (!question) throw new NotFoundError("Question not found", { questionId });

    const view = await loadView(attemptQuestion, question);
    if (answer.type !== view.type) {
      throw new BadRequestError("Answer type does not match the question", {
        expected: view.type,
      });
    }

    const isCorrect = gradeAnswer(answer, view.accepted);
    const isPractice = attempt.kind === "practice";
    const [mastery, storedAnswerCount, practiceRating] = await Promise.all([
      userMasteryRepository.findById({ userId, lessonId: question.lessonId }),
      attemptAnswerRepository.countByUserAndLesson(userId, question.lessonId),
      isPractice ? getPracticeRating(attempt.id, userId, question.lessonId) : null,
    ]);
    const answerCount = storedAnswerCount + (practiceRating?.sessionAnswers ?? 0);
    const ratingBefore = practiceRating?.rating ?? mastery?.rating ?? startingRating;
    const score = getScore(isCorrect, attemptQuestion.hintsUsed);
    const ratingAfter = getNextRating(ratingBefore, attemptQuestion.difficulty, score, answerCount);

    const answerOptionId =
      answer.type === "multiple_choice" &&
      attemptQuestion.generatedQuestion === null &&
      view.options?.some((option) => option.id === answer.optionId)
        ? answer.optionId
        : null;

    const saved = await attemptAnswerRepository.recordAnswer({
      answer: {
        assessmentAttemptId: attempt.id,
        questionId: question.id,
        attemptQuestionId: attemptQuestion.id,
        answerOptionId,
        seed: attemptQuestion.seed,
        generatedQuestion: attemptQuestion.generatedQuestion,
        response: answer,
        isCorrect,
        difficulty: attemptQuestion.difficulty,
        hintsUsed: attemptQuestion.hintsUsed,
        ratingBefore,
        ratingAfter,
      },
      mastery: isPractice
        ? null
        : {
            userId,
            lessonId: question.lessonId,
            rating: ratingAfter,
            mastery: getMastery(ratingAfter),
            currentDifficulty: getNextDifficulty(ratingAfter),
          },
    });

    const state = await loadAttemptState(attempt);
    const correctAnswer = view.accepted[0] as LearnerAnswer;
    return {
      data: {
        isCorrect,
        correctAnswer,
        explanation: view.explanation,
        replay: view.replay,
        hintsUsed: saved.hintsUsed,
        points: getAnswerPoints(saved),
        rating: { before: ratingBefore, after: ratingAfter },
        ...state,
      },
    };
  };
};

export type SubmitAnswer = ReturnType<typeof makeSubmitAnswer>;
