import { describe, expect, it, vi } from "vitest";

import type { PrismaClient } from "@/generated/prisma/client";
import { PrismaLeaderboardRepository } from "@/infrastructure/leaderboard/repositories";

const challengeDate = new Date("2026-11-12T00:00:00.000Z");
const startedAt = new Date("2026-11-12T05:59:00.000Z");
const finishedAt = new Date("2026-11-12T06:00:00.000Z");

const rows = [
  {
    userId: "user-1",
    passed: true,
    points: 100,
    startedAt,
    finishedAt,
    user: { name: "Ada", profile: { showOnLeaderboard: true } },
  },
  {
    userId: "user-2",
    passed: false,
    points: 0,
    startedAt,
    finishedAt,
    user: { name: "Bea", profile: { showOnLeaderboard: false } },
  },
  {
    userId: "user-3",
    passed: true,
    points: 80,
    startedAt,
    finishedAt,
    user: { name: "Cy", profile: null },
  },
];

describe("PrismaLeaderboardRepository", () => {
  it("lists finished daily challenges for the date, passed or not", async () => {
    const findMany = vi.fn().mockResolvedValue(rows);
    const client = { assessmentAttempt: { findMany } } as unknown as PrismaClient;

    const results = await new PrismaLeaderboardRepository(client).listDailyChallengeResults(
      challengeDate,
    );

    expect(findMany).toHaveBeenCalledWith({
      where: {
        kind: "daily_challenge",
        finishedAt: { not: null },
        dailyChallenge: { date: challengeDate },
      },
      select: {
        userId: true,
        passed: true,
        points: true,
        startedAt: true,
        finishedAt: true,
        user: {
          select: {
            name: true,
            profile: { select: { showOnLeaderboard: true } },
          },
        },
      },
    });
    expect(results).toEqual([
      {
        userId: "user-1",
        displayName: "Ada",
        showOnLeaderboard: true,
        passed: true,
        points: 100,
        startedAt,
        finishedAt,
      },
      {
        userId: "user-2",
        displayName: "Bea",
        showOnLeaderboard: false,
        passed: false,
        points: 0,
        startedAt,
        finishedAt,
      },
      {
        userId: "user-3",
        displayName: "Cy",
        showOnLeaderboard: false,
        passed: true,
        points: 80,
        startedAt,
        finishedAt,
      },
    ]);
  });
});
