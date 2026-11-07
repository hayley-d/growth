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
  tree: "20,10,#,#,30,#,#",
  answer: { type: "order_nodes", keys: [10, 20, 30] },
  isRetired: false,
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

  it("writes a null answer as Prisma.DbNull and keeps a real one", async () => {
    const question = {
      create: vi.fn().mockResolvedValue(row),
      update: vi.fn().mockResolvedValue(row),
    };
    const client = { question } as unknown as PrismaClient;
    const repository = new PrismaQuestionRepository(client);

    await repository.update(row.id, { answer: null });
    await repository.update(row.id, { answer: row.answer, tree: row.tree });

    expect(question.update).toHaveBeenNthCalledWith(1, {
      where: { id: row.id },
      data: expect.objectContaining({ answer: Prisma.DbNull }),
    });
    expect(question.update).toHaveBeenNthCalledWith(2, {
      where: { id: row.id },
      data: expect.objectContaining({ answer: row.answer, tree: row.tree }),
    });
  });

  it("lists a lesson's questions without the retired ones", async () => {
    const question = { findMany: vi.fn().mockResolvedValue([row]) };
    const client = { question } as unknown as PrismaClient;

    const questions = await new PrismaQuestionRepository(client).listActiveByLessonId(row.lessonId);

    expect(question.findMany).toHaveBeenCalledWith({
      where: { lessonId: row.lessonId, isRetired: false },
      orderBy: [{ lessonId: "asc" }, { difficulty: "asc" }],
    });
    expect(questions).toEqual([row]);
  });
});
