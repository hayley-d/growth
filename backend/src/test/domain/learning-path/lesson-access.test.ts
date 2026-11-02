import { describe, expect, it } from "vitest";

import { canOpenLesson, getLessonNeighbours } from "@/domain/learning-path/lesson-access";

const lessons = [
  { id: "lesson-1", unitId: "unit-1" },
  { id: "lesson-2", unitId: "unit-1" },
  { id: "lesson-3", unitId: "unit-2" },
];

describe("getLessonNeighbours", () => {
  it("has no previous lesson for the first lesson", () => {
    expect(getLessonNeighbours(lessons, "lesson-1")).toEqual({
      previousLessonId: null,
      nextLessonId: "lesson-2",
    });
  });

  it("crosses unit boundaries", () => {
    expect(getLessonNeighbours(lessons, "lesson-3")).toEqual({
      previousLessonId: "lesson-2",
      nextLessonId: null,
    });
  });

  it("returns null for a lesson that is not on the path", () => {
    expect(getLessonNeighbours(lessons, "unknown")).toBeNull();
  });
});

describe("canOpenLesson", () => {
  const neighbours = { previousLessonId: "lesson-1", nextLessonId: null };

  it("always opens the first lesson", () => {
    expect(canOpenLesson({ previousLessonId: null, nextLessonId: null }, null)).toBe(true);
  });

  it("opens when the previous lesson is completed", () => {
    expect(canOpenLesson(neighbours, { completed: true, testPassed: false })).toBe(true);
  });

  it("opens when the previous lesson's test is passed", () => {
    expect(canOpenLesson(neighbours, { completed: false, testPassed: true })).toBe(true);
  });

  it("stays locked when the previous lesson is neither completed nor passed", () => {
    expect(canOpenLesson(neighbours, { completed: false, testPassed: false })).toBe(false);
  });
});
