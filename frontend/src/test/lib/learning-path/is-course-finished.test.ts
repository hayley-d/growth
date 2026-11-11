import { expect, it } from "vitest";

import { isCourseFinished } from "@/lib/learning-path/is-course-finished";

it("is finished only when every lesson is completed", () => {
  expect(isCourseFinished([{ status: "completed" }, { status: "completed" }])).toBe(true);
  expect(isCourseFinished([{ status: "completed" }, { status: "current" }])).toBe(false);
});

it("is not finished when there are no lessons", () => {
  expect(isCourseFinished([])).toBe(false);
});
