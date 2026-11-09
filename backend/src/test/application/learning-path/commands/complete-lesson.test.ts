import { describe, expect, it, vi } from "vitest";

import { makeCompleteLesson } from "@/application/learning-path/commands/complete-lesson";
import { NotFoundError } from "@/domain/errors";
import { createAccessDependencies, userId } from "@/test/application/lesson/lesson-fakes";

const createCompleteLesson = () => {
  const completeAll = vi.fn().mockResolvedValue(undefined);
  const completeLesson = makeCompleteLesson({
    lessonRepository: createAccessDependencies().lessonRepository,
    lessonProgressRepository: { completeAll },
  });
  return { completeLesson, completeAll };
};

describe("makeCompleteLesson", () => {
  it("completes the first lesson on its own", async () => {
    const { completeLesson, completeAll } = createCompleteLesson();
    await completeLesson({ userId, lessonId: "lesson-1" });
    expect(completeAll).toHaveBeenCalledWith(userId, ["lesson-1"], expect.any(Date));
  });

  it("completes every lesson before a tested-out lesson, across units", async () => {
    const { completeLesson, completeAll } = createCompleteLesson();
    await completeLesson({ userId, lessonId: "checkpoint-1" });
    expect(completeAll).toHaveBeenCalledWith(
      userId,
      ["lesson-1", "lesson-2", "checkpoint-1"],
      expect.any(Date),
    );
  });

  it.each(["nope", "retired-1"])("rejects %s without writing", async (lessonId) => {
    const { completeLesson, completeAll } = createCompleteLesson();
    await expect(completeLesson({ userId, lessonId })).rejects.toBeInstanceOf(NotFoundError);
    expect(completeAll).not.toHaveBeenCalled();
  });
});
