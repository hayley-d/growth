import type { DailyChallengeResult } from "@/domain/leaderboard/rank-leaderboard";

export type LeaderboardRepository = {
  listDailyChallengeResults(challengeDate: Date): Promise<DailyChallengeResult[]>;
};
