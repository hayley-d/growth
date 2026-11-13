import { toDayNumber } from "@/domain/activity/streak";
import type { DailyChallenge } from "@/domain/assessment/daily-challenge";
import {
  pickChallengeQuestion,
  toChallengeDate,
  toChallengeSeed,
} from "@/domain/assessment/daily-challenge-rotation";
import type { DailyChallengeRepository } from "@/domain/assessment/repositories/daily-challenge-repository";
import type { QuestionRepository } from "@/domain/assessment/repositories/question-repository";
import type { Clock } from "@/domain/common/clock";
import { ConflictError } from "@/domain/errors";

type GetTodaysChallengeDependencies = {
  clock: Clock;
  dailyChallengeRepository: Pick<DailyChallengeRepository, "findByDate" | "create">;
  questionRepository: Pick<QuestionRepository, "listActiveGenerated">;
};

export const makeGetTodaysChallenge =
  ({ clock, dailyChallengeRepository, questionRepository }: GetTodaysChallengeDependencies) =>
  async (): Promise<DailyChallenge> => {
    const date = toChallengeDate(clock.now());
    const existing = await dailyChallengeRepository.findByDate(date);
    if (existing) return existing;

    const dayNumber = toDayNumber(date);
    const question = pickChallengeQuestion(
      await questionRepository.listActiveGenerated(),
      dayNumber,
    );
    if (!question) throw new ConflictError("No daily challenge questions yet");

    try {
      return await dailyChallengeRepository.create({
        date,
        questionId: question.id,
        seed: toChallengeSeed(dayNumber),
      });
    } catch (error) {
      if (!(error instanceof ConflictError)) throw error;
      const winner = await dailyChallengeRepository.findByDate(date);
      if (!winner) throw error;
      return winner;
    }
  };

export type GetTodaysChallenge = ReturnType<typeof makeGetTodaysChallenge>;
