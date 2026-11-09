import type { LessonRepository } from "@/domain/course-content/repositories/lesson-repository";

type CanTakeTestDependencies = {
  lessonRepository: Pick<LessonRepository, "findById">;
};

export const makeCanTakeTest =
  ({ lessonRepository }: CanTakeTestDependencies) =>
  async (_userId: string, lessonId: string): Promise<boolean> => {
    const lesson = await lessonRepository.findById(lessonId);
    return lesson !== null && !lesson.isRetired;
  };

export type CanTakeTest = ReturnType<typeof makeCanTakeTest>;
