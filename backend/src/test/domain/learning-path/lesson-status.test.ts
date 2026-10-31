import { describe, expect, it } from "vitest";

import { getLessonStatuses } from "@/domain/learning-path/lesson-status";

const lessons = [
  { id: "lesson-1", unitId: "unit-1" },
  { id: "lesson-2", unitId: "unit-1" },
  { id: "lesson-3", unitId: "unit-2" },
];

function statusesOf(completedLessonIds: string[]) {
  return getLessonStatuses(lessons, new Set(completedLessonIds)).map((entry) => entry.status);
}

describe("getLessonStatuses", () => {
  it("makes the first lesson current and the rest locked when nothing is done", () => {
    expect(statusesOf([])).toEqual(["current", "locked", "locked"]);
  });

  it("moves current to the first lesson not completed", () => {
    expect(statusesOf(["lesson-1"])).toEqual(["completed", "current", "locked"]);
  });

  it("has no current lesson when everything is done", () => {
    expect(statusesOf(["lesson-1", "lesson-2", "lesson-3"])).toEqual([
      "completed",
      "completed",
      "completed",
    ]);
  });

  it("keeps a completed lesson completed when earlier lessons are not", () => {
    expect(statusesOf(["lesson-3"])).toEqual(["current", "locked", "completed"]);
  });

  it("ignores ids that are not on the path", () => {
    expect(statusesOf(["unknown"])).toEqual(["current", "locked", "locked"]);
  });

  it("returns an empty list for an empty path", () => {
    expect(getLessonStatuses([], new Set())).toEqual([]);
  });

  it("keeps the lesson it was given", () => {
    const [first] = getLessonStatuses(lessons, new Set());
    expect(first?.lesson).toBe(lessons[0]);
  });
});
