import { describe, expect, it } from "vitest";

import { getTestPoolLessonIds } from "@/domain/assessment/test-pool";
import { lessons } from "@/test/application/assessment/attempt-fakes";

const lessonById = (id: string) => {
  const lesson = lessons.find((candidate) => candidate.id === id);
  if (!lesson) throw new Error(`unknown lesson ${id}`);
  return lesson;
};

describe("getTestPoolLessonIds", () => {
  it("tests a lesson on its own questions", () => {
    expect(getTestPoolLessonIds(lessons, lessonById("lesson-b"))).toEqual(["lesson-b"]);
  });

  it("tests a checkpoint on its whole unit", () => {
    expect(getTestPoolLessonIds(lessons, lessonById("checkpoint-1"))).toEqual([
      "lesson-a",
      "lesson-b",
      "checkpoint-1",
    ]);
  });

  it("tests the last checkpoint on every lesson", () => {
    expect(getTestPoolLessonIds(lessons, lessonById("final-1"))).toEqual(
      lessons.map((lesson) => lesson.id),
    );
  });

  it("treats a lone checkpoint as the final challenge", () => {
    const checkpoint = lessonById("checkpoint-1");
    const pair = [lessonById("lesson-a"), checkpoint];
    expect(getTestPoolLessonIds(pair, checkpoint)).toEqual(["lesson-a", "checkpoint-1"]);
  });
});
