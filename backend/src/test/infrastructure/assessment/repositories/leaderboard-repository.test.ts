import { describe, expect, it, vi } from "vitest";

import type { PrismaClient } from "@/generated/prisma/client";
import { PrismaLeaderboardRepository } from "@/infrastructure/assessment/repositories";

const challengeDate = new Date("2026-11-12T00:00:00.000Z");
const finishedAt = new Date("2026-11-12T06:00:00.000Z");

const rows = [
  {
    userId: "user-1",
    finishedAt,
    user: { name: "Ada", profile: { showOnLeaderboard: true } },
  },
  {
    userId: "user-2",
    finishedAt,
    user: { name: "Bea", profile: { showOnLeaderboard: false } },
  },
  {
    userId: "user-3",
    finishedAt,
    user: { name: "Cy", profile: null },
  },
];

describe("PrismaLeaderboardRepository", () => {
  it("lists passed daily challenges for the date", async () => {
    const findMany = vi.fn().mockResolvedValue(rows);
    const client = { assessmentAttempt: { findMany } } as unknown as PrismaClient;

    const results = await new PrismaLeaderboardRepository(client).listDailyChallengeResults(
      challengeDate,
    );

    expect(findMany).toHaveBeenCalledWith({
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
    expect(results).toEqual([
      { userId: "user-1", displayName: "Ada", showOnLeaderboard: true, finishedAt },
      { userId: "user-2", displayName: "Bea", showOnLeaderboard: false, finishedAt },
      { userId: "user-3", displayName: "Cy", showOnLeaderboard: false, finishedAt },
    ]);
  });

  it("a failed attempt is not ranked", async () => {
    const passed = {
      userId: "user-1",
      finishedAt,
      passed: true,
      kind: "daily_challenge",
      dailyChallenge: { date: challengeDate },
      user: { name: "Ada", profile: { showOnLeaderboard: true } },
    };
    const failed = {
      ...passed,
      userId: "user-2",
      passed: false,
      user: { name: "Bea", profile: { showOnLeaderboard: true } },
    };
    const findMany = vi.fn(
      async (query: { where: { passed?: boolean; dailyChallenge?: { date: Date } } }) =>
        [passed, failed].filter(
          (attempt) =>
            attempt.passed === query.where.passed &&
            attempt.dailyChallenge.date.getTime() === query.where.dailyChallenge?.date.getTime(),
        ),
    );
    const client = { assessmentAttempt: { findMany } } as unknown as PrismaClient;

    const results = await new PrismaLeaderboardRepository(client).listDailyChallengeResults(
      challengeDate,
    );

    expect(results).toEqual([
      { userId: "user-1", displayName: "Ada", showOnLeaderboard: true, finishedAt },
    ]);
  });
});
