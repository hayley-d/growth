import type { DailyChallenge } from "@/domain/assessment/daily-challenge";
import type { DailyChallenge as DailyChallengeRow } from "@/generated/prisma/client";

export const toDailyChallenge = (row: DailyChallengeRow): DailyChallenge => ({
  id: row.id,
  date: row.date,
  questionId: row.questionId,
  seed: row.seed,
});
