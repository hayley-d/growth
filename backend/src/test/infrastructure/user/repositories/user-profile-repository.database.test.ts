import { randomUUID } from "node:crypto";
import { describe, expect, it } from "vitest";

import { BadRequestError } from "@/domain/errors";
import type { PrismaClient } from "@/generated/prisma/client";
import { prismaClient } from "@/infrastructure/database/prisma-client";
import { PrismaUserProfileRepository } from "@/infrastructure/user/repositories";

const userId = "user-profile-database-test-user";
const rollback = new Error("Roll back the test transaction");

const inRolledBackTransaction = (
  work: (repository: PrismaUserProfileRepository) => Promise<void>,
) =>
  expect(
    prismaClient.$transaction(async (transaction) => {
      await transaction.user.create({
        data: { id: userId, name: "Profile test", email: `${userId}@example.com` },
      });
      await transaction.userProfile.create({ data: { userId } });
      await work(new PrismaUserProfileRepository(transaction as unknown as PrismaClient));
      throw rollback;
    }),
  ).rejects.toBe(rollback);

describe("PrismaUserProfileRepository against Postgres", () => {
  it.each([
    ["learning style", { learningStyleId: randomUUID() }],
    ["code language", { codeLanguageId: randomUUID() }],
  ])("turns an unknown %s into a BadRequestError", async (_name, changes) => {
    await inRolledBackTransaction(async (repository) => {
      await expect(
        repository.update(userId, { ...changes, onboardingComplete: true }),
      ).rejects.toBeInstanceOf(BadRequestError);
    });
  });
});
