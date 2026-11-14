import { getNextDifficulty, startingRating } from "@/domain/assessment/elo-rating";
import type { AttemptAnswerRepository } from "@/domain/assessment/repositories/attempt-answer-repository";
import type { AttemptQuestionRepository } from "@/domain/assessment/repositories/attempt-question-repository";
import type { QuestionRepository } from "@/domain/assessment/repositories/question-repository";
import type { UserMasteryRepository } from "@/domain/user/repositories/user-mastery-repository";

type PracticeRatingDependencies = {
  attemptQuestionRepository: Pick<AttemptQuestionRepository, "listByAttemptId">;
  attemptAnswerRepository: Pick<AttemptAnswerRepository, "listByAttemptId">;
  questionRepository: Pick<QuestionRepository, "listByIds">;
  userMasteryRepository: Pick<UserMasteryRepository, "findById">;
};

export type PracticeRating = {
  rating: number;
  difficulty: number;
  sessionAnswers: number;
};

export const makeGetPracticeRating =
  ({
    attemptQuestionRepository,
    attemptAnswerRepository,
    questionRepository,
    userMasteryRepository,
  }: PracticeRatingDependencies) =>
  async (attemptId: string, userId: string, lessonId: string): Promise<PracticeRating> => {
    const [served, answers, mastery] = await Promise.all([
      attemptQuestionRepository.listByAttemptId(attemptId),
      attemptAnswerRepository.listByAttemptId(attemptId),
      userMasteryRepository.findById({ userId, lessonId }),
    ]);
    const questions = await questionRepository.listByIds([
      ...new Set(answers.map((answer) => answer.questionId)),
    ]);
    const lessonIdByQuestionId = new Map(
      questions.map((question) => [question.id, question.lessonId]),
    );
    const positionById = new Map(served.map((row) => [row.id, row.position]));
    const sessionAnswers = answers
      .filter((answer) => lessonIdByQuestionId.get(answer.questionId) === lessonId)
      .sort(
        (first, second) =>
          (positionById.get(first.attemptQuestionId) ?? 0) -
          (positionById.get(second.attemptQuestionId) ?? 0),
      );

    const last = sessionAnswers.at(-1);
    if (last) {
      return {
        rating: last.ratingAfter,
        difficulty: getNextDifficulty(last.ratingAfter),
        sessionAnswers: sessionAnswers.length,
      };
    }
    return {
      rating: mastery?.rating ?? startingRating,
      difficulty: mastery?.currentDifficulty ?? 1,
      sessionAnswers: 0,
    };
  };
