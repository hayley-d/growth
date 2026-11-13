import { describe, expect, it, vi } from "vitest";

import type { PrismaClient } from "@/generated/prisma/client";
import { PrismaAssessmentAttemptRepository } from "@/infrastructure/assessment/repositories";

const row = {
  id: "8d3c1f9e-4b1a-4c55-9d0e-2f6a7b8c9d01",
  userId: "user-1",
  lessonId: null,
  dailyChallengeId: "1b2c3d4e-5f60-4718-9a2b-3c4d5e6f7a80",
  kind: "daily_challenge" as const,
  practiceTopic: null,
  score: 0,
  passed: false,
  points: 0,
  startedAt: new Date("2026-11-14T06:00:00.000Z"),
  finishedAt: null,
};

describe("PrismaAssessmentAttemptRepository", () => {
  it("finds a learner's attempt at a daily challenge by the compound key", async () => {
    const assessmentAttempt = { findUnique: vi.fn().mockResolvedValue(row) };
    const client = { assessmentAttempt } as unknown as PrismaClient;

    const found = await new PrismaAssessmentAttemptRepository(client).findByUserAndDailyChallenge(
      row.userId,
      row.dailyChallengeId,
    );

    expect(assessmentAttempt.findUnique).toHaveBeenCalledWith({
      where: {
        userId_dailyChallengeId: { userId: row.userId, dailyChallengeId: row.dailyChallengeId },
      },
    });
    expect(found).toEqual(row);
  });
});
