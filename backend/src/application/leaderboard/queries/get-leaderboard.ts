import { type LeaderboardResponse, toLeaderboardResponse } from "@shared/schemas";
import { getSignedInUserId } from "@/application/lesson/lesson-access";
import { rankLeaderboard } from "@/domain/leaderboard/rank-leaderboard";
import type { LeaderboardRepository } from "@/domain/leaderboard/repositories/leaderboard-repository";
import { startOfSouthAfricanDay } from "@/domain/leaderboard/south-african-day";

const southAfricanDayMs = 24 * 60 * 60 * 1000;

type GetLeaderboardDependencies = {
  leaderboardRepository: LeaderboardRepository;
  now: () => Date;
};

export const makeGetLeaderboard =
  ({ leaderboardRepository, now }: GetLeaderboardDependencies) =>
  async (): Promise<LeaderboardResponse> => {
    const userId = getSignedInUserId();
    const from = startOfSouthAfricanDay(now());
    const to = new Date(from.getTime() + southAfricanDayMs);
    const results = await leaderboardRepository.listDailyChallengeResults(from, to);
    return toLeaderboardResponse(rankLeaderboard(results, userId, from));
  };

export type GetLeaderboard = ReturnType<typeof makeGetLeaderboard>;
