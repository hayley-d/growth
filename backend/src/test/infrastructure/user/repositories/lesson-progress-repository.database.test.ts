import { randomUUID } from "node:crypto";
import { describe, expect, it } from "vitest";

import type { Prisma, PrismaClient } from "@/generated/prisma/client";
import { prismaClient } from "@/infrastructure/database/prisma-client";
import { PrismaLessonProgressRepository } from "@/infrastructure/user/repositories";

type Transaction = Prisma.TransactionClient;

const userId = "lesson-progress-database-test-user";
const unitId = randomUUID();
const lessonIds = [randomUUID(), randomUUID(), randomUUID()] as const;
const [firstLessonId, secondLessonId, thirdLessonId] = lessonIds;
const earlier = new Date("2026-11-01T10:00:00.000Z");
const later = new Date("2026-11-08T10:00:00.000Z");
const rollback = new Error("Roll back the test transaction");

const runInOrder = async (operations: Promise<unknown>[]) => {
  const results: unknown[] = [];
  for (const operation of operations) results.push(await operation);
  return results;
};

const repositoryIn = (transaction: Transaction) =>
  new PrismaLessonProgressRepository(
    new Proxy(transaction, {
      get: (target, property) =>
        property === "$transaction" ? runInOrder : Reflect.get(target, property),
    }) as unknown as PrismaClient,
  );

const inRolledBackTransaction = (
  work: (repository: PrismaLessonProgressRepository) => Promise<void>,
) =>
  expect(
    prismaClient.$transaction(async (transaction) => {
      await transaction.user.create({
        data: { id: userId, name: "Progress test", email: `${userId}@example.com` },
      });
      await transaction.unit.create({
        data: { id: unitId, title: "Progress test", position: -1_000_000 },
      });
      await transaction.lesson.createMany({
        data: lessonIds.map((id, index) => ({
          id,
          unitId,
          title: `Lesson ${index + 1}`,
          summary: "Summary",
          kind: "lesson" as const,
          position: index + 1,
        })),
      });
      await work(repositoryIn(transaction));
      throw rollback;
    }),
  ).rejects.toBe(rollback);

const rowsByLessonId = async (repository: PrismaLessonProgressRepository) =>
  Object.fromEntries(
    (await repository.listByUserId(userId)).map((row) => [
      row.lessonId,
      { status: row.status, completedAt: row.completedAt },
    ]),
  );

describe("PrismaLessonProgressRepository against Postgres", () => {
  it("starts a lesson once and never moves a completed lesson back to started", async () => {
    await inRolledBackTransaction(async (repository) => {
      await repository.start({ userId, lessonId: firstLessonId });
      await repository.start({ userId, lessonId: firstLessonId });
      await repository.completeAll(userId, [secondLessonId], earlier);
      await repository.start({ userId, lessonId: secondLessonId });

      expect(await rowsByLessonId(repository)).toEqual({
        [firstLessonId]: { status: "started", completedAt: null },
        [secondLessonId]: { status: "completed", completedAt: earlier },
      });
    });
  });

  it("completes a test-out without overwriting earlier completedAt values", async () => {
    await inRolledBackTransaction(async (repository) => {
      await repository.completeAll(userId, [firstLessonId], earlier);
      await repository.start({ userId, lessonId: secondLessonId });
      await repository.completeAll(userId, lessonIds, later);

      expect(await rowsByLessonId(repository)).toEqual({
        [firstLessonId]: { status: "completed", completedAt: earlier },
        [secondLessonId]: { status: "completed", completedAt: later },
        [thirdLessonId]: { status: "completed", completedAt: later },
      });
    });
  });

  it("changes nothing when the same lessons are completed twice", async () => {
    await inRolledBackTransaction(async (repository) => {
      await repository.completeAll(userId, lessonIds, earlier);
      const before = await rowsByLessonId(repository);
      await repository.completeAll(userId, lessonIds, later);

      expect(await rowsByLessonId(repository)).toEqual(before);
    });
  });
});
