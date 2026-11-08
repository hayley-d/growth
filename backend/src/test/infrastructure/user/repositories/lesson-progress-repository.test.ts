import { describe, expect, it, vi } from "vitest";

import type { PrismaClient } from "@/generated/prisma/client";
import { PrismaLessonProgressRepository } from "@/infrastructure/user/repositories";

const row = {
  userId: "user-1",
  lessonId: "1b2c3d4e-5f60-4718-9a2b-3c4d5e6f7a80",
  status: "completed" as const,
  completedAt: new Date("2026-11-02T10:00:00.000Z"),
};

describe("PrismaLessonProgressRepository", () => {
  it("lists one learner's progress rows", async () => {
    const lessonProgress = { findMany: vi.fn().mockResolvedValue([row]) };
    const client = { lessonProgress } as unknown as PrismaClient;

    await expect(
      new PrismaLessonProgressRepository(client).listByUserId(row.userId),
    ).resolves.toEqual([row]);
    expect(lessonProgress.findMany).toHaveBeenCalledWith({
      where: { userId: row.userId },
      orderBy: [{ userId: "asc" }, { lessonId: "asc" }],
    });
  });
});
