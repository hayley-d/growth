import { describe, expect, it, vi } from "vitest";

import type { PrismaClient } from "@/generated/prisma/client";
import { PrismaLeaderboardRepository } from "@/infrastructure/assessment/repositories";

const from = new Date("2026-11-11T22:00:00.000Z");
const to = new Date("2026-11-12T22:00:00.000Z");
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
  it("lists finished daily challenges in the window", async () => {
    const findMany = vi.fn().mockResolvedValue(rows);
    const client = { assessmentAttempt: { findMany } } as unknown as PrismaClient;

    const results = await new PrismaLeaderboardRepository(client).listDailyChallengeResults(
      from,
      to,
    );

    expect(findMany).toHaveBeenCalledWith({
      where: {
        kind: "daily_challenge",
        finishedAt: { gte: from, lt: to },
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
});
