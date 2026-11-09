import { describe, expect, it } from "vitest";

import { requestContext } from "@/application/context/request-context";
import { makeStartLesson } from "@/application/lesson/commands/start-lesson";
import { ForbiddenError, NotFoundError, UnauthorizedError } from "@/domain/errors";
import type { ProgressStatus } from "@/domain/user/lesson-progress";
import {
  asLearner,
  createAccessDependencies,
  createProgressRepository,
} from "@/test/application/lesson/lesson-fakes";

const createStartLesson = (progress: Record<string, ProgressStatus> = {}) => {
  const lessonProgressRepository = createProgressRepository(progress);
  const startLesson = makeStartLesson({
    ...createAccessDependencies(),
    lessonProgressRepository,
  });
  return { startLesson, stored: lessonProgressRepository.stored };
};

describe("makeStartLesson", () => {
  it("starts the first lesson for a new learner", async () => {
    const { startLesson, stored } = createStartLesson();
    await asLearner(() => startLesson({ id: "lesson-1" }));
    expect(stored.get("lesson-1")?.status).toBe("started");
  });

  it("starts the current lesson", async () => {
    const { startLesson, stored } = createStartLesson({ "lesson-1": "completed" });
    await asLearner(() => startLesson({ id: "lesson-2" }));
    expect(stored.get("lesson-2")?.status).toBe("started");
  });

  it("keeps a completed lesson completed", async () => {
    const { startLesson, stored } = createStartLesson({ "lesson-1": "completed" });
    await asLearner(() => startLesson({ id: "lesson-1" }));
    expect(stored.get("lesson-1")?.status).toBe("completed");
  });

  it("keeps one row when the lesson is started twice", async () => {
    const { startLesson, stored } = createStartLesson();
    await asLearner(() => startLesson({ id: "lesson-1" }));
    await asLearner(() => startLesson({ id: "lesson-1" }));
    expect([...stored.values()]).toHaveLength(1);
  });

  it("rejects a locked lesson without writing a row", async () => {
    const { startLesson, stored } = createStartLesson();
    await expect(asLearner(() => startLesson({ id: "lesson-2" }))).rejects.toBeInstanceOf(
      ForbiddenError,
    );
    expect(stored.size).toBe(0);
  });

  it.each(["nope", "retired-1"])("treats %s as not found", async (id) => {
    const { startLesson } = createStartLesson();
    await expect(asLearner(() => startLesson({ id }))).rejects.toBeInstanceOf(NotFoundError);
  });

  it("throws when nobody is signed in", async () => {
    const { startLesson } = createStartLesson();
    await expect(
      requestContext.run({ requestId: "request-1" }, () => startLesson({ id: "lesson-1" })),
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });
});
