import type { LessonRepository } from "@/domain/course-content/repositories/lesson-repository";
import { completeThrough } from "@/domain/learning-path/complete-through";
import type { LessonProgressRepository } from "@/domain/user/repositories/lesson-progress-repository";

type CompleteLessonDependencies = {
  lessonRepository: Pick<LessonRepository, "listAll">;
  lessonProgressRepository: Pick<LessonProgressRepository, "completeAll">;
};

export type CompleteLessonInput = {
  userId: string;
  lessonId: string;
};

export const makeCompleteLesson =
  ({ lessonRepository, lessonProgressRepository }: CompleteLessonDependencies) =>
  async ({ userId, lessonId }: CompleteLessonInput): Promise<void> => {
    const lessonIds = completeThrough(await lessonRepository.listAll(), lessonId);
    await lessonProgressRepository.completeAll(userId, lessonIds, new Date());
  };

export type CompleteLesson = ReturnType<typeof makeCompleteLesson>;
