import { describe, expect, it } from "vitest";

import {
  attemptQuestionSchema,
  attemptStateResponseSchema,
  requestHintRequestSchema,
  submitAnswerRequestSchema,
  submitAnswerResponseSchema,
} from "@shared/schemas";

const id = "8d3c1f9e-4b1a-4c55-9d0e-2f6a7b8c9d01";

const attempt = {
  id,
  lessonId: id,
  kind: "lesson_test",
  status: "in_progress",
  total: 5,
  answeredCount: 0,
  startedAt: "2026-11-09T10:00:00.000Z",
  finishedAt: null,
};

const question = {
  id,
  position: 1,
  type: "text",
  prompt: "Name the traversal.",
  tree: null,
  difficulty: 1,
  hints: [],
  hintsTotal: 3,
  hintsRemaining: 3,
};

describe("attemptQuestionSchema", () => {
  it("parses a question with no unlocked hints", () => {
    expect(attemptQuestionSchema.parse(question).hintsRemaining).toBe(3);
  });

  it("does not let an answer through", () => {
    const parsed = attemptQuestionSchema.parse({
      ...question,
      answer: { type: "text", text: "pre-order" },
    });
    expect(parsed).not.toHaveProperty("answer");
  });

  it("rejects a difficulty above 5", () => {
    expect(attemptQuestionSchema.safeParse({ ...question, difficulty: 6 }).success).toBe(false);
  });
});

describe("attemptStateResponseSchema", () => {
  it("parses an attempt in progress", () => {
    const parsed = attemptStateResponseSchema.parse({
      data: { attempt, question, result: null },
    });
    expect(parsed.data.result).toBeNull();
  });

  it("rejects a daily challenge attempt", () => {
    const result = attemptStateResponseSchema.safeParse({
      data: { attempt: { ...attempt, kind: "daily_challenge" }, question, result: null },
    });
    expect(result.success).toBe(false);
  });
});

describe("requestHintRequestSchema", () => {
  it("needs a question id", () => {
    expect(requestHintRequestSchema.safeParse({}).success).toBe(false);
    expect(requestHintRequestSchema.safeParse({ questionId: id }).success).toBe(true);
  });
});

describe("submitAnswerRequestSchema", () => {
  it("parses a question id with an answer", () => {
    const result = submitAnswerRequestSchema.parse({
      questionId: id,
      answer: { type: "order_nodes", keys: [1, 2, 3] },
    });
    expect(result.answer.type).toBe("order_nodes");
  });

  it("rejects a missing answer", () => {
    expect(submitAnswerRequestSchema.safeParse({ questionId: id }).success).toBe(false);
  });
});

describe("submitAnswerResponseSchema", () => {
  it("parses feedback with the next question", () => {
    const parsed = submitAnswerResponseSchema.parse({
      data: {
        isCorrect: true,
        correctAnswer: { type: "text", text: "pre-order" },
        explanation: "Root first.",
        replay: { kind: "traversal", order: "preorder" },
        hintsUsed: 0,
        points: 100,
        rating: { before: 1000, after: 1010 },
        attempt,
        question,
        result: null,
      },
    });
    expect(parsed.data.rating.after).toBe(1010);
    expect(parsed.data.replay).toEqual({ kind: "traversal", order: "preorder" });
  });
});
