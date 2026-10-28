import { describe, expect, it, vi } from "vitest";

import { Prisma, type PrismaClient } from "@/generated/prisma/client";
import { PrismaAttemptAnswerRepository } from "@/infrastructure/assessment/repositories";

const row = {
  id: "8d3c1f9e-4b1a-4c55-9d0e-2f6a7b8c9d01",
  assessmentAttemptId: "1b2c3d4e-5f60-4718-9a2b-3c4d5e6f7a80",
  questionId: "2c3d4e5f-6071-4829-8b3c-4d5e6f7a8b91",
  answerOptionId: null,
  seed: null,
  generatedQuestion: null,
  response: { type: "order_nodes", keys: [10, 20, 30] },
  isCorrect: true,
  difficulty: 2,
  hintsUsed: 0,
  ratingBefore: 1000,
  ratingAfter: 1016,
};

describe("PrismaAttemptAnswerRepository", () => {
  it("writes response through toJsonInput and a missing generatedQuestion as Prisma.DbNull", async () => {
    const attemptAnswer = { create: vi.fn().mockResolvedValue(row) };
    const client = { attemptAnswer } as unknown as PrismaClient;

    await new PrismaAttemptAnswerRepository(client).create({
      assessmentAttemptId: row.assessmentAttemptId,
      questionId: row.questionId,
      generatedQuestion: null,
      response: row.response,
      isCorrect: row.isCorrect,
      difficulty: row.difficulty,
      ratingBefore: row.ratingBefore,
      ratingAfter: row.ratingAfter,
    });

    expect(attemptAnswer.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        response: row.response,
        generatedQuestion: Prisma.DbNull,
      }),
    });
  });
});
