import { describe, expect, it } from "vitest";

import { makeCanTakeTest } from "@/application/learning-path/queries/can-take-test";
import { createAccessDependencies, userId } from "@/test/application/lesson/lesson-fakes";

const canTakeTest = makeCanTakeTest({
  lessonRepository: createAccessDependencies().lessonRepository,
});

describe("makeCanTakeTest", () => {
  it.each(["lesson-1", "lesson-2", "checkpoint-1"])(
    "allows the test of %s, locked or not",
    async (lessonId) => {
      await expect(canTakeTest(userId, lessonId)).resolves.toBe(true);
    },
  );

  it.each(["nope", "retired-1"])("does not allow the test of %s", async (lessonId) => {
    await expect(canTakeTest(userId, lessonId)).resolves.toBe(false);
  });
});
