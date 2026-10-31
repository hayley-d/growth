import { describe, expect, it } from "vitest";

import { NotFoundError } from "@/domain/errors";
import { completeThrough } from "@/domain/learning-path/complete-through";

const lessons = [
  { id: "lesson-1", unitId: "unit-1" },
  { id: "lesson-2", unitId: "unit-1" },
  { id: "lesson-3", unitId: "unit-2" },
  { id: "lesson-4", unitId: "unit-2" },
];

describe("completeThrough", () => {
  it("returns only the first lesson for the first lesson", () => {
    expect(completeThrough(lessons, "lesson-1")).toEqual(["lesson-1"]);
  });

  it("returns every lesson up to and including the target", () => {
    expect(completeThrough(lessons, "lesson-2")).toEqual(["lesson-1", "lesson-2"]);
  });

  it("crosses unit boundaries", () => {
    expect(completeThrough(lessons, "lesson-3")).toEqual(["lesson-1", "lesson-2", "lesson-3"]);
  });

  it("returns every lesson for the last lesson", () => {
    expect(completeThrough(lessons, "lesson-4")).toEqual([
      "lesson-1",
      "lesson-2",
      "lesson-3",
      "lesson-4",
    ]);
  });

  it("throws NotFoundError for a lesson that is not on the path", () => {
    expect(() => completeThrough(lessons, "unknown")).toThrow(NotFoundError);
  });

  it("throws NotFoundError for an empty path", () => {
    expect(() => completeThrough([], "lesson-1")).toThrow(NotFoundError);
  });
});
