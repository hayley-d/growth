import { expect, it } from "vitest";

import { clampStep, lessonSearchSchema } from "@/lib/lesson/lesson-search";

it("reads the step as a number and drops anything else", () => {
  expect(lessonSearchSchema.parse({ step: "3" })).toEqual({ step: 3 });
  expect(lessonSearchSchema.parse({ step: "zero" })).toEqual({ step: undefined });
  expect(lessonSearchSchema.parse({ step: 0 })).toEqual({ step: undefined });
  expect(lessonSearchSchema.parse({})).toEqual({ step: undefined });
});

it("keeps the step between 1 and the finish step", () => {
  expect(clampStep(undefined, 5)).toBe(1);
  expect(clampStep(3, 5)).toBe(3);
  expect(clampStep(9, 5)).toBe(5);
  expect(clampStep(2, 0)).toBe(1);
});
