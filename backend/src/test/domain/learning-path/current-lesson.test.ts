import { describe, expect, it } from "vitest";

import { getCurrentLesson } from "@/domain/learning-path/current-lesson";

const lessons = [
  { id: "lesson-1", unitId: "unit-1" },
  { id: "lesson-2", unitId: "unit-1" },
  { id: "lesson-3", unitId: "unit-2" },
];

describe("getCurrentLesson", () => {
  it("returns the first lesson when nothing is done", () => {
    expect(getCurrentLesson(lessons, new Set())).toBe(lessons[0]);
  });

  it("returns the first lesson not completed", () => {
    expect(getCurrentLesson(lessons, new Set(["lesson-1"]))).toBe(lessons[1]);
  });

  it("returns the first gap even when a later lesson is completed", () => {
    expect(getCurrentLesson(lessons, new Set(["lesson-1", "lesson-3"]))).toBe(lessons[1]);
  });

  it("returns the last lesson when everything is done", () => {
    expect(getCurrentLesson(lessons, new Set(["lesson-1", "lesson-2", "lesson-3"]))).toBe(
      lessons[2],
    );
  });

  it("returns undefined for an empty path", () => {
    expect(getCurrentLesson([], new Set())).toBeUndefined();
  });
});
