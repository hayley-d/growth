import type { DailyChallengeResult } from "@/domain/leaderboard/rank-leaderboard";

export type LeaderboardRepository = {
  listDailyChallengeResults(from: Date, to: Date): Promise<DailyChallengeResult[]>;
};
