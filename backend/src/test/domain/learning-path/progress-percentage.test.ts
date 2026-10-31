import { describe, expect, it } from "vitest";

import { getOverallProgress, getUnitProgress } from "@/domain/learning-path/progress-percentage";

const lessons = [
  { id: "lesson-1", unitId: "unit-1" },
  { id: "lesson-2", unitId: "unit-1" },
  { id: "lesson-3", unitId: "unit-2" },
  { id: "lesson-4", unitId: "unit-2" },
  { id: "lesson-5", unitId: "unit-2" },
  { id: "lesson-6", unitId: "unit-2" },
];

describe("getUnitProgress", () => {
  it("reports each unit in path order", () => {
    expect(getUnitProgress(lessons, new Set(["lesson-1", "lesson-3"]))).toEqual([
      { unitId: "unit-1", percentage: 50 },
      { unitId: "unit-2", percentage: 25 },
    ]);
  });

  it("reports 0 for every unit when nothing is done", () => {
    expect(getUnitProgress(lessons, new Set())).toEqual([
      { unitId: "unit-1", percentage: 0 },
      { unitId: "unit-2", percentage: 0 },
    ]);
  });

  it("reports 100 for a finished unit", () => {
    expect(getUnitProgress(lessons, new Set(["lesson-1", "lesson-2"]))[0]).toEqual({
      unitId: "unit-1",
      percentage: 100,
    });
  });

  it("rounds down so a bar never shows 100 early", () => {
    const threeLessons = [
      { id: "a", unitId: "unit-1" },
      { id: "b", unitId: "unit-1" },
      { id: "c", unitId: "unit-1" },
    ];
    expect(getUnitProgress(threeLessons, new Set(["a"]))).toEqual([
      { unitId: "unit-1", percentage: 33 },
    ]);
    expect(getUnitProgress(threeLessons, new Set(["a", "b"]))).toEqual([
      { unitId: "unit-1", percentage: 66 },
    ]);
  });

  it("ignores ids that are not on the path", () => {
    expect(getUnitProgress(lessons, new Set(["unknown"]))[0]?.percentage).toBe(0);
  });

  it("returns an empty list for an empty path", () => {
    expect(getUnitProgress([], new Set())).toEqual([]);
  });
});

describe("getOverallProgress", () => {
  it("counts completed lessons across all units", () => {
    expect(getOverallProgress(lessons, new Set(["lesson-1", "lesson-2", "lesson-3"]))).toBe(50);
  });

  it("reports 100 when everything is done", () => {
    expect(getOverallProgress(lessons, new Set(lessons.map((lesson) => lesson.id)))).toBe(100);
  });

  it("rounds down", () => {
    expect(getOverallProgress(lessons, new Set(["lesson-1"]))).toBe(16);
  });

  it("reports 0 for an empty path", () => {
    expect(getOverallProgress([], new Set())).toBe(0);
  });
});
