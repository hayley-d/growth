import { describe, expect, it } from "vitest";

import { generatedQuestionSchema, learnerAnswerSchema } from "@shared/schemas/assessment";

describe("learnerAnswerSchema", () => {
  it("parses a multiple choice answer", () => {
    const result = learnerAnswerSchema.parse({
      type: "multiple_choice",
      optionId: "8d3c1f9e-4b1a-4c55-9d0e-2f6a7b8c9d01",
    });
    expect(result.type).toBe("multiple_choice");
  });

  it("parses a build tree answer", () => {
    const result = learnerAnswerSchema.parse({ type: "build_tree", tree: "20,10,#,#,30,#,#" });
    expect(result.type).toBe("build_tree");
  });

  it("parses an order nodes answer", () => {
    const result = learnerAnswerSchema.parse({ type: "order_nodes", keys: [10, 20, 30] });
    expect(result.type).toBe("order_nodes");
  });

  it("parses a predict rotation answer", () => {
    const result = learnerAnswerSchema.parse({
      type: "predict_rotation",
      rotation: "leftRight",
      pivotKey: 20,
    });
    expect(result.type).toBe("predict_rotation");
  });

  it("parses a text answer", () => {
    const result = learnerAnswerSchema.parse({ type: "text", text: "Rotate left at 20." });
    expect(result.type).toBe("text");
  });

  it("rejects an unknown type", () => {
    expect(learnerAnswerSchema.safeParse({ type: "unknown", text: "x" }).success).toBe(false);
  });
});

describe("generatedQuestionSchema", () => {
  const base = {
    type: "order_nodes" as const,
    prompt: "What is the in-order traversal?",
    tree: "20,10,#,#,30,#,#",
    explanation: "In-order visits left, root, right.",
    hints: ["Start from the left", "Visit the root next"],
  };

  it("parses a generated question whose answer type matches", () => {
    const result = generatedQuestionSchema.parse({
      ...base,
      answer: { type: "order_nodes", keys: [10, 20, 30] },
    });
    expect(result.type).toBe("order_nodes");
  });

  it("rejects a generated question whose answer type doesn't match", () => {
    const result = generatedQuestionSchema.safeParse({
      ...base,
      answer: { type: "text", text: "10, 20, 30" },
    });
    expect(result.success).toBe(false);
  });
});
