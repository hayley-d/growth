import type { IdParam, PracticeSummaryResponse } from "@shared/schemas";
import { getAnswerPoints } from "@/application/assessment/attempt-state";
import {
  makeResolveOwnedPractice,
  type PracticeDependencies,
} from "@/application/assessment/practice-session";
import { getAttemptScore } from "@/domain/assessment/attempt-score";

export const makeFinishPractice = (dependencies: PracticeDependencies) => {
  const {
    assessmentAttemptRepository,
    attemptQuestionRepository,
    attemptAnswerRepository,
    questionRepository,
    lessonRepository,
  } = dependencies;
  const resolveOwnedPractice = makeResolveOwnedPractice(dependencies);

  return async ({ id }: IdParam): Promise<PracticeSummaryResponse> => {
    const attempt = await resolveOwnedPractice(id);
    const [served, answers] = await Promise.all([
      attemptQuestionRepository.listByAttemptId(id),
      attemptAnswerRepository.listByAttemptId(id),
    ]);
    const answerByServedId = new Map(answers.map((answer) => [answer.attemptQuestionId, answer]));
    const answered = served.flatMap((attemptQuestion) => {
      const answer = answerByServedId.get(attemptQuestion.id);
      return answer ? [answer] : [];
    });
    const correct = answered.filter((answer) => answer.isCorrect).length;

    if (!attempt.finishedAt) {
      await assessmentAttemptRepository.update(id, {
        score: getAttemptScore(correct, answered.length),
        points: answered.reduce((total, answer) => total + getAnswerPoints(answer), 0),
        finishedAt: new Date(),
      });
    }

    const questions = await questionRepository.listByIds([
      ...new Set(answered.map((answer) => answer.questionId)),
    ]);
    const lessonIdByQuestionId = new Map(
      questions.map((question) => [question.id, question.lessonId]),
    );
    const ratings = new Map<string, { before: number; after: number }>();
    for (const answer of answered) {
      const lessonId = lessonIdByQuestionId.get(answer.questionId);
      if (!lessonId) continue;
      ratings.set(lessonId, {
        before: ratings.get(lessonId)?.before ?? answer.ratingBefore,
        after: answer.ratingAfter,
      });
    }

    const lessons = await Promise.all(
      [...ratings].map(async ([lessonId, rating]) => ({
        lessonId,
        title: (await lessonRepository.findById(lessonId))?.title ?? "",
        ratingBefore: rating.before,
        ratingAfter: rating.after,
      })),
    );

    return {
      data: {
        answered: answered.length,
        correct,
        ratingChange: answered.reduce(
          (total, answer) => total + answer.ratingAfter - answer.ratingBefore,
          0,
        ),
        lessons,
      },
    };
  };
};

export type FinishPractice = ReturnType<typeof makeFinishPractice>;
