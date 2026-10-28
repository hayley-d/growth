import { describe, expect, it, vi } from "vitest";

import { Prisma, type PrismaClient } from "@/generated/prisma/client";
import { PrismaUserMasteryRepository } from "@/infrastructure/user/repositories";

const row = {
  userId: "8d3c1f9e-4b1a-4c55-9d0e-2f6a7b8c9d01",
  lessonId: "1b2c3d4e-5f60-4718-9a2b-3c4d5e6f7a80",
  rating: 1016,
  mastery: new Prisma.Decimal("0.7500"),
  currentDifficulty: 2,
  updatedAt: new Date("2026-10-28T00:00:00.000Z"),
};

describe("PrismaUserMasteryRepository", () => {
  it("finds a user's mastery by the compound key", async () => {
    const userMastery = { findUnique: vi.fn().mockResolvedValue(row) };
    const client = { userMastery } as unknown as PrismaClient;

    const found = await new PrismaUserMasteryRepository(client).findById({
      userId: row.userId,
      lessonId: row.lessonId,
    });

    expect(userMastery.findUnique).toHaveBeenCalledWith({
      where: { userId_lessonId: { userId: row.userId, lessonId: row.lessonId } },
    });
    expect(found?.mastery).toBe(0.75);
  });
});
