import { describe, expect, it } from "vitest";

import { practiceSummarySchema, startPracticeRequestSchema } from "@shared/schemas";

describe("startPracticeRequestSchema", () => {
  it("accepts each topic", () => {
    for (const topic of ["traversals", "insertion", "deletion", "rotations", "mixed"]) {
      expect(startPracticeRequestSchema.parse({ topic }).topic).toBe(topic);
    }
  });

  it("rejects an unknown topic", () => {
    expect(startPracticeRequestSchema.safeParse({ topic: "heaps" }).success).toBe(false);
  });
});

describe("practiceSummarySchema", () => {
  it("allows a negative rating change", () => {
    const parsed = practiceSummarySchema.parse({
      answered: 2,
      correct: 0,
      ratingChange: -20,
      lessons: [],
    });
    expect(parsed.ratingChange).toBe(-20);
  });
});
