import { describe, expect, it, vi } from "vitest";

import { Prisma, type PrismaClient } from "@/generated/prisma/client";
import { PrismaQuestionRepository } from "@/infrastructure/assessment/repositories";

const row = {
  id: "8d3c1f9e-4b1a-4c55-9d0e-2f6a7b8c9d01",
  lessonId: "1b2c3d4e-5f60-4718-9a2b-3c4d5e6f7a80",
  reviewLessonId: "2c3d4e5f-6071-4829-8b3c-4d5e6f7a8b91",
  type: "order_nodes" as const,
  difficulty: 2,
  bloomsLevel: "understand" as const,
  prompt: "Order the keys in-order.",
  generatorKey: null,
  generatorOptions: null,
  explanation: "In-order visits left, root, right.",
};

describe("PrismaQuestionRepository", () => {
  it("writes a missing generatorOptions as Prisma.DbNull", async () => {
    const question = { create: vi.fn().mockResolvedValue(row) };
    const client = { question } as unknown as PrismaClient;

    await new PrismaQuestionRepository(client).create({
      lessonId: row.lessonId,
      reviewLessonId: row.reviewLessonId,
      type: row.type,
      difficulty: row.difficulty,
      bloomsLevel: row.bloomsLevel,
      prompt: row.prompt,
      generatorOptions: null,
      explanation: row.explanation,
    });

    expect(question.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ generatorOptions: Prisma.DbNull }),
    });
  });
});
