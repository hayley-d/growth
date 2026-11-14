import { describe, expect, it } from "vitest";

import { dailyChallengeStateSchema } from "@shared/schemas";

const question = {
  id: "8d3c1f9e-4b1a-4c55-9d0e-2f6a7b8c9d01",
  position: 1,
  type: "text" as const,
  prompt: "What is the height of the tree?",
  tree: "20,10,#,#,30,#,#",
  difficulty: 2,
  hints: [],
  hintsTotal: 0,
  hintsRemaining: 0,
};

const base = {
  date: "2026-11-14",
  nextChallengeAt: "2026-11-14T22:00:00.000Z",
  startedAt: null,
  finishedAt: null,
  question: null,
  result: null,
};

describe("dailyChallengeStateSchema", () => {
  it("accepts a challenge that hasn't started", () => {
    expect(dailyChallengeStateSchema.safeParse({ ...base, status: "not_started" }).success).toBe(
      true,
    );
  });

  it("accepts a challenge in progress with its question", () => {
    const parsed = dailyChallengeStateSchema.safeParse({
      ...base,
      status: "in_progress",
      startedAt: "2026-11-14T06:00:00.000Z",
      question,
    });
    expect(parsed.success).toBe(true);
  });

  it("accepts a finished challenge with its result", () => {
    const parsed = dailyChallengeStateSchema.safeParse({
      ...base,
      status: "finished",
      startedAt: "2026-11-14T06:00:00.000Z",
      finishedAt: "2026-11-14T06:01:05.000Z",
      result: {
        prompt: question.prompt,
        tree: question.tree,
        response: { type: "text", text: "3" },
        isCorrect: false,
        correctAnswer: { type: "text", text: "2" },
        explanation: "A leaf has height 1.",
        replay: null,
        points: 0,
        timeTakenSeconds: 65,
      },
    });
    expect(parsed.success).toBe(true);
  });

  it("rejects a question that carries its answer", () => {
    const parsed = dailyChallengeStateSchema.safeParse({
      ...base,
      status: "in_progress",
      startedAt: "2026-11-14T06:00:00.000Z",
      question: { ...question, answer: { type: "text", text: "2" } },
    });
    expect(parsed.success).toBe(false);
  });

  it("rejects an unknown status", () => {
    expect(dailyChallengeStateSchema.safeParse({ ...base, status: "skipped" }).success).toBe(false);
  });
});
