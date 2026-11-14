import type { DailyChallengeResult } from "@/domain/leaderboard/rank-leaderboard";
import type { LeaderboardRepository } from "@/domain/leaderboard/repositories/leaderboard-repository";
import type { PrismaClient } from "@/generated/prisma/client";
import { withPrismaErrors } from "@/infrastructure/database/prisma-errors";

export class PrismaLeaderboardRepository implements LeaderboardRepository {
  constructor(private readonly client: PrismaClient) {}

  listDailyChallengeResults(challengeDate: Date) {
    return withPrismaErrors(async () => {
      const rows = await this.client.assessmentAttempt.findMany({
        where: {
          kind: "daily_challenge",
          passed: true,
          finishedAt: { not: null },
          dailyChallenge: { date: challengeDate },
        },
        select: {
          userId: true,
          finishedAt: true,
          user: {
            select: {
              name: true,
              profile: { select: { showOnLeaderboard: true } },
            },
          },
        },
      });
      const results: DailyChallengeResult[] = [];
      for (const row of rows) {
        if (!row.finishedAt) continue;
        results.push({
          userId: row.userId,
          displayName: row.user.name,
          showOnLeaderboard: row.user.profile?.showOnLeaderboard ?? false,
          finishedAt: row.finishedAt,
        });
      }
      return results;
    });
  }
}
