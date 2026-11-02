import { describe, expect, it } from "vitest";

import { makeGetLessonNote } from "@/application/lesson/queries/get-lesson-note";
import { ForbiddenError, NotFoundError } from "@/domain/errors";
import {
  asLearner,
  createAccessDependencies,
  createLessonNoteRepository,
  userId,
} from "@/test/application/lesson/lesson-fakes";

const existingNote = {
  userId,
  lessonId: "lesson-1",
  body: "my words",
  updatedAt: new Date("2026-11-02T09:00:00.000Z"),
};

const createGetLessonNote = (notes = [existingNote]) =>
  makeGetLessonNote({
    ...createAccessDependencies(),
    lessonNoteRepository: createLessonNoteRepository(notes),
  });

describe("makeGetLessonNote", () => {
  it("returns the learner's note", async () => {
    const response = await asLearner(() => createGetLessonNote()({ id: "lesson-1" }));
    expect(response).toEqual({
      data: { lessonId: "lesson-1", body: "my words", updatedAt: "2026-11-02T09:00:00.000Z" },
    });
  });

  it("returns an empty note when there is none yet", async () => {
    const response = await asLearner(() => createGetLessonNote([])({ id: "lesson-1" }));
    expect(response).toEqual({ data: { lessonId: "lesson-1", body: "", updatedAt: null } });
  });

  it("returns an empty note for a lesson with no notes step", async () => {
    const getLessonNote = makeGetLessonNote({
      ...createAccessDependencies({ progress: { "lesson-2": "completed" } }),
      lessonNoteRepository: createLessonNoteRepository([]),
    });
    const response = await asLearner(() => getLessonNote({ id: "checkpoint-1" }));
    expect(response.data.body).toBe("");
  });

  it("rejects a missing lesson", async () => {
    await expect(asLearner(() => createGetLessonNote()({ id: "nope" }))).rejects.toBeInstanceOf(
      NotFoundError,
    );
  });

  it("rejects a locked lesson", async () => {
    await expect(asLearner(() => createGetLessonNote()({ id: "lesson-2" }))).rejects.toBeInstanceOf(
      ForbiddenError,
    );
  });
});
