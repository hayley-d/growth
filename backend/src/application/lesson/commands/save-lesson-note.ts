import type { IdParam, LessonNoteResponse, SaveLessonNoteRequest } from "@shared/schemas";
import {
  getSignedInUserId,
  type LessonAccessDependencies,
  makeResolveLessonAccess,
} from "@/application/lesson/lesson-access";
import { toLessonNoteResponse } from "@/application/lesson/lesson-mapper";
import { BadRequestError } from "@/domain/errors";
import type { LessonNoteRepository } from "@/domain/user/repositories/lesson-note-repository";

type SaveLessonNoteDependencies = LessonAccessDependencies & {
  lessonNoteRepository: Pick<LessonNoteRepository, "findById" | "create" | "update">;
};

export type SaveLessonNoteInput = IdParam & SaveLessonNoteRequest;

export const makeSaveLessonNote = (dependencies: SaveLessonNoteDependencies) => {
  const resolveLessonAccess = makeResolveLessonAccess(dependencies);
  const { lessonNoteRepository } = dependencies;

  return async ({ id: lessonId, body }: SaveLessonNoteInput): Promise<LessonNoteResponse> => {
    const userId = getSignedInUserId();
    const { lesson } = await resolveLessonAccess(userId, lessonId);
    if (lesson.notePrompt === null) {
      throw new BadRequestError("This lesson has no notes step", { lessonId });
    }

    const key = { userId, lessonId };
    const existing = await lessonNoteRepository.findById(key);
    const note = existing
      ? await lessonNoteRepository.update(key, { body })
      : await lessonNoteRepository.create({ ...key, body });
    return toLessonNoteResponse(lessonId, note);
  };
};

export type SaveLessonNote = ReturnType<typeof makeSaveLessonNote>;
