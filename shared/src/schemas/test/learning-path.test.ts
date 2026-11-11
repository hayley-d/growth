import { describe, expect, it } from "vitest";

import { learningPathResponseSchema, masteryLabel, toLearningPathResponse } from "@shared/schemas";

const lessonId = "1b2c3d4e-5f60-4718-9a2b-3c4d5e6f7a80";

const data = {
  units: [
    {
      id: "8d3c1f9e-4b1a-4c55-9d0e-2f6a7b8c9d01",
      title: "Traversals",
      position: 1,
      progress: 0,
      lessons: [
        {
          id: lessonId,
          title: "In-order",
          summary: "Left, node, right.",
          kind: "lesson" as const,
          position: 1,
          status: "current" as const,
          mastery: 0,
        },
      ],
    },
  ],
  progress: 0,
  currentLessonId: lessonId,
};

describe("learningPathResponseSchema", () => {
  it("wraps the path in data", () => {
    expect(toLearningPathResponse(data)).toEqual({ data });
  });

  it("allows no current lesson for an empty path", () => {
    expect(toLearningPathResponse({ units: [], progress: 0, currentLessonId: null })).toEqual({
      data: { units: [], progress: 0, currentLessonId: null },
    });
  });

  it("rejects an unknown lesson status", () => {
    const [unit] = data.units;
    const lessons = unit?.lessons.map((lesson) => ({ ...lesson, status: "started" }));
    expect(
      learningPathResponseSchema.safeParse({ data: { ...data, units: [{ ...unit, lessons }] } })
        .success,
    ).toBe(false);
  });

  it("rejects progress over 100", () => {
    expect(learningPathResponseSchema.safeParse({ data: { ...data, progress: 101 } }).success).toBe(
      false,
    );
  });
});

describe("masteryLabel", () => {
  it.each([
    [0, "Just started"],
    [39, "Just started"],
    [40, "Getting there"],
    [79, "Getting there"],
    [80, "Strong"],
    [100, "Strong"],
  ])("labels %i as %s", (mastery, label) => {
    expect(masteryLabel(mastery)).toBe(label);
  });
});
