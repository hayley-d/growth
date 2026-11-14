import { type LeaderboardResponse, toLeaderboardResponse } from "@shared/schemas";
import { getSignedInUserId } from "@/application/lesson/lesson-access";
import { toChallengeDate, toNextChallengeAt } from "@/domain/assessment/daily-challenge-rotation";
import type { Clock } from "@/domain/common/clock";
import { rankLeaderboard } from "@/domain/leaderboard/rank-leaderboard";
import type { LeaderboardRepository } from "@/domain/leaderboard/repositories/leaderboard-repository";

const millisecondsPerDay = 24 * 60 * 60 * 1000;

type GetLeaderboardDependencies = {
  leaderboardRepository: LeaderboardRepository;
  clock: Clock;
};

export const makeGetLeaderboard =
  ({ leaderboardRepository, clock }: GetLeaderboardDependencies) =>
  async (): Promise<LeaderboardResponse> => {
    const userId = getSignedInUserId();
    const challengeDate = toChallengeDate(clock.now());
    const dayStart = new Date(toNextChallengeAt(challengeDate).getTime() - millisecondsPerDay);
    const results = await leaderboardRepository.listDailyChallengeResults(challengeDate);
    return toLeaderboardResponse(rankLeaderboard(results, userId, dayStart));
  };

export type GetLeaderboard = ReturnType<typeof makeGetLeaderboard>;
