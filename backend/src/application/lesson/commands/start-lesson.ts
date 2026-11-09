import type { IdParam } from "@shared/schemas";
import {
  getSignedInUserId,
  type LessonAccessDependencies,
  makeResolveLessonAccess,
} from "@/application/lesson/lesson-access";
import type { LessonProgressRepository } from "@/domain/user/repositories/lesson-progress-repository";

type StartLessonDependencies = LessonAccessDependencies & {
  lessonProgressRepository: Pick<LessonProgressRepository, "findById" | "listByUserId" | "start">;
};

export const makeStartLesson = (dependencies: StartLessonDependencies) => {
  const resolveLessonAccess = makeResolveLessonAccess(dependencies);
  const { lessonProgressRepository } = dependencies;

  return async ({ id: lessonId }: IdParam): Promise<void> => {
    const userId = getSignedInUserId();
    await resolveLessonAccess(userId, lessonId);
    await lessonProgressRepository.start({ userId, lessonId });
  };
};

export type StartLesson = ReturnType<typeof makeStartLesson>;
