import { describe, expect, it } from "vitest";

import { makeSaveLessonNote } from "@/application/lesson/commands/save-lesson-note";
import { BadRequestError, ForbiddenError, NotFoundError } from "@/domain/errors";
import {
  asLearner,
  createAccessDependencies,
  createLessonNoteRepository,
  userId,
} from "@/test/application/lesson/lesson-fakes";

const createSaveLessonNote = (notes = createLessonNoteRepository(), passed: string[] = []) =>
  makeSaveLessonNote({
    ...createAccessDependencies({ passedLessonIds: passed }),
    lessonNoteRepository: notes,
  });

describe("makeSaveLessonNote", () => {
  it("creates the note the first time", async () => {
    const notes = createLessonNoteRepository();
    const response = await asLearner(() =>
      createSaveLessonNote(notes)({ id: "lesson-1", body: "first" }),
    );
    expect(response.data.body).toBe("first");
    expect(notes.stored.get(`${userId}:lesson-1`)?.body).toBe("first");
  });

  it("updates the note after that", async () => {
    const notes = createLessonNoteRepository();
    const save = createSaveLessonNote(notes);
    await asLearner(() => save({ id: "lesson-1", body: "first" }));
    const response = await asLearner(() => save({ id: "lesson-1", body: "second  " }));
    expect(response.data.body).toBe("second  ");
    expect(response.data.updatedAt).toBe("2026-11-02T11:00:00.000Z");
    expect(notes.stored.size).toBe(1);
  });

  it("saves an empty body", async () => {
    const response = await asLearner(() => createSaveLessonNote()({ id: "lesson-1", body: "" }));
    expect(response.data.body).toBe("");
    expect(response.data.updatedAt).not.toBeNull();
  });

  it("rejects a missing lesson", async () => {
    await expect(
      asLearner(() => createSaveLessonNote()({ id: "nope", body: "x" })),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("rejects a locked lesson", async () => {
    await expect(
      asLearner(() => createSaveLessonNote()({ id: "lesson-2", body: "x" })),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });

  it("opens the lesson after a passed test", async () => {
    const response = await asLearner(() =>
      createSaveLessonNote(createLessonNoteRepository(), ["lesson-1"])({
        id: "lesson-2",
        body: "x",
      }),
    );
    expect(response.data.lessonId).toBe("lesson-2");
  });

  it("rejects a lesson with no notes step", async () => {
    const notes = createLessonNoteRepository();
    const save = makeSaveLessonNote({
      ...createAccessDependencies({ progress: { "lesson-2": "completed" } }),
      lessonNoteRepository: notes,
    });
    await expect(asLearner(() => save({ id: "checkpoint-1", body: "x" }))).rejects.toBeInstanceOf(
      BadRequestError,
    );
    expect(notes.stored.size).toBe(0);
  });
});
