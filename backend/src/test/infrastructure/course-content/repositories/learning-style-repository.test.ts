import { describe, expect, it, vi } from "vitest";

import type { PrismaClient } from "@/generated/prisma/client";
import { PrismaLearningStyleRepository } from "@/infrastructure/course-content/repositories";

const row = {
  id: "5b2e7c1a-9f3d-4e8b-a6c0-1d2e3f4a5b60",
  name: "Visual",
  description: "You learn best from diagrams.",
};

describe("PrismaLearningStyleRepository", () => {
  it("upserts a learning style by its unique name", async () => {
    const learningStyle = { upsert: vi.fn().mockResolvedValue(row) };
    const client = { learningStyle } as unknown as PrismaClient;
    const newLearningStyle = { name: "Visual", description: "You learn best from diagrams." };
    await expect(
      new PrismaLearningStyleRepository(client).upsertByName(newLearningStyle),
    ).resolves.toEqual(row);
    expect(learningStyle.upsert).toHaveBeenCalledWith({
      where: { name: "Visual" },
      create: newLearningStyle,
      update: newLearningStyle,
    });
  });
});
