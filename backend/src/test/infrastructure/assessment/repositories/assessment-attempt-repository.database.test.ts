import { randomUUID } from "node:crypto";
import { describe, expect, it } from "vitest";

import { ConflictError } from "@/domain/errors";
import type { PrismaClient } from "@/generated/prisma/client";
import { PrismaAssessmentAttemptRepository } from "@/infrastructure/assessment/repositories";
import { prismaClient } from "@/infrastructure/database/prisma-client";

const userId = "assessment-attempt-database-test-user";
const unitId = randomUUID();
const lessonId = randomUUID();
const questionId = randomUUID();
const dailyChallengeId = randomUUID();
const rollback = new Error("Roll back the test transaction");

describe("PrismaAssessmentAttemptRepository against Postgres", () => {
  it("allows one daily challenge attempt per learner per day", async () => {
    await expect(
      prismaClient.$transaction(async (transaction) => {
        await transaction.user.create({
          data: { id: userId, name: "Attempt test", email: `${userId}@example.com` },
        });
        await transaction.unit.create({
          data: { id: unitId, title: "Attempt test", position: -1_000_002 },
        });
        await transaction.lesson.create({
          data: {
            id: lessonId,
            unitId,
            title: "Attempt test",
            summary: "Summary",
            kind: "lesson",
            position: 1,
          },
        });
        await transaction.question.create({
          data: {
            id: questionId,
            lessonId,
            reviewLessonId: lessonId,
            type: "order_nodes",
            difficulty: 1,
            bloomsLevel: "apply",
            generatorKey: "traversal-order",
            explanation: "",
          },
        });
        await transaction.dailyChallenge.create({
          data: {
            id: dailyChallengeId,
            date: new Date("1900-01-02T00:00:00.000Z"),
            questionId,
            seed: 1,
          },
        });
        const repository = new PrismaAssessmentAttemptRepository(
          transaction as unknown as PrismaClient,
        );
        await repository.create({ userId, kind: "practice", practiceTopic: "mixed" });
        await repository.create({ userId, kind: "practice", practiceTopic: "mixed" });
        await repository.create({ userId, kind: "daily_challenge", dailyChallengeId });

        expect(
          await repository.findByUserAndDailyChallenge(userId, dailyChallengeId),
        ).toMatchObject({ userId, dailyChallengeId });
        await expect(
          repository.create({ userId, kind: "daily_challenge", dailyChallengeId }),
        ).rejects.toBeInstanceOf(ConflictError);
        throw rollback;
      }),
    ).rejects.toBe(rollback);
  });
});
