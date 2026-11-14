import { type LeaderboardResponse, toLeaderboardResponse } from "@shared/schemas";
import { getSignedInUserId } from "@/application/lesson/lesson-access";
import { toChallengeDate } from "@/domain/assessment/daily-challenge-rotation";
import type { Clock } from "@/domain/common/clock";
import { rankLeaderboard } from "@/domain/leaderboard/rank-leaderboard";
import type { LeaderboardRepository } from "@/domain/leaderboard/repositories/leaderboard-repository";

type GetLeaderboardDependencies = {
  leaderboardRepository: LeaderboardRepository;
  clock: Clock;
};

export const makeGetLeaderboard =
  ({ leaderboardRepository, clock }: GetLeaderboardDependencies) =>
  async (): Promise<LeaderboardResponse> => {
    const userId = getSignedInUserId();
    const challengeDate = toChallengeDate(clock.now());
    const results = await leaderboardRepository.listDailyChallengeResults(challengeDate);
    return toLeaderboardResponse(rankLeaderboard(results, userId));
  };

export type GetLeaderboard = ReturnType<typeof makeGetLeaderboard>;
