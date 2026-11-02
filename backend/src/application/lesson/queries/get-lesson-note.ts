import type { IdParam, LessonNoteResponse } from "@shared/schemas";
import {
  getSignedInUserId,
  type LessonAccessDependencies,
  makeResolveLessonAccess,
} from "@/application/lesson/lesson-access";
import { toLessonNoteResponse } from "@/application/lesson/lesson-mapper";
import type { LessonNoteRepository } from "@/domain/user/repositories/lesson-note-repository";

type GetLessonNoteDependencies = LessonAccessDependencies & {
  lessonNoteRepository: Pick<LessonNoteRepository, "findById">;
};

export const makeGetLessonNote = (dependencies: GetLessonNoteDependencies) => {
  const resolveLessonAccess = makeResolveLessonAccess(dependencies);

  return async ({ id: lessonId }: IdParam): Promise<LessonNoteResponse> => {
    const userId = getSignedInUserId();
    await resolveLessonAccess(userId, lessonId);
    const note = await dependencies.lessonNoteRepository.findById({ userId, lessonId });
    return toLessonNoteResponse(lessonId, note);
  };
};

export type GetLessonNote = ReturnType<typeof makeGetLessonNote>;
