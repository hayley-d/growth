import { describe, expect, it } from "vitest";

import { caseStudyTaskSchema } from "@shared/schemas/case-study";

describe("caseStudyTaskSchema", () => {
  it("parses a task with a goal", () => {
    const result = caseStudyTaskSchema.parse({
      startingKeys: [20, 10, 30],
      allowedOperations: ["insert"],
      instructions: "Insert 25 and keep the tree balanced.",
      goal: { kind: "containsKeys", keys: [25] },
    });
    expect(result.goal).toEqual({ kind: "containsKeys", keys: [25] });
  });

  it("rejects a task with no goal", () => {
    const result = caseStudyTaskSchema.safeParse({
      startingKeys: [20, 10, 30],
      allowedOperations: ["insert"],
      instructions: "Insert 25 and keep the tree balanced.",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a goal with an unknown kind", () => {
    const result = caseStudyTaskSchema.safeParse({
      startingKeys: [20, 10, 30],
      allowedOperations: ["insert"],
      instructions: "Insert 25 and keep the tree balanced.",
      goal: { kind: "unknown" },
    });
    expect(result.success).toBe(false);
  });
});
