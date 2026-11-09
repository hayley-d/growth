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
  const opens = (completed: string[], lessonId: string) =>
    canOpenLesson(lessons, new Set(completed), lessonId);

  it("opens the first lesson for a new learner and locks the rest", () => {
    expect(opens([], "lesson-1")).toBe(true);
    expect(opens([], "lesson-2")).toBe(false);
  });

  it("opens the current lesson and completed ones", () => {
    expect(opens(["lesson-1"], "lesson-1")).toBe(true);
    expect(opens(["lesson-1"], "lesson-2")).toBe(true);
    expect(opens(["lesson-1"], "lesson-3")).toBe(false);
  });

  it("keeps a completed lesson open after a gap and locks the lesson after it", () => {
    expect(opens(["lesson-2"], "lesson-1")).toBe(true);
    expect(opens(["lesson-2"], "lesson-2")).toBe(true);
    expect(opens(["lesson-2"], "lesson-3")).toBe(false);
  });

  it("does not open a lesson that is not on the path", () => {
    expect(opens([], "unknown")).toBe(false);
  });
});
