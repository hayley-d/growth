import { randomUUID } from "node:crypto";
import { describe, expect, it } from "vitest";

import { ConflictError } from "@/domain/errors";
import type { PrismaClient } from "@/generated/prisma/client";
import { PrismaDailyChallengeRepository } from "@/infrastructure/assessment/repositories";
import { prismaClient } from "@/infrastructure/database/prisma-client";

const unitId = randomUUID();
const lessonId = randomUUID();
const questionId = randomUUID();
const date = new Date("1900-01-01T00:00:00.000Z");
const rollback = new Error("Roll back the test transaction");

describe("PrismaDailyChallengeRepository against Postgres", () => {
  it("turns a second row for the same date into a ConflictError", async () => {
    await expect(
      prismaClient.$transaction(async (transaction) => {
        await transaction.unit.create({
          data: { id: unitId, title: "Daily challenge test", position: -1_000_001 },
        });
        await transaction.lesson.create({
          data: {
            id: lessonId,
            unitId,
            title: "Daily challenge test",
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
        const repository = new PrismaDailyChallengeRepository(
          transaction as unknown as PrismaClient,
        );
        await repository.create({ date, questionId, seed: 1 });

        await expect(repository.create({ date, questionId, seed: 2 })).rejects.toBeInstanceOf(
          ConflictError,
        );
        throw rollback;
      }),
    ).rejects.toBe(rollback);
  });
});
