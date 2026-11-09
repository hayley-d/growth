import { requestContext } from "@/application/context/request-context";
import type { Lesson } from "@/domain/course-content/lesson";
import type { LessonRepository } from "@/domain/course-content/repositories/lesson-repository";
import { ForbiddenError, NotFoundError, UnauthorizedError } from "@/domain/errors";
import {
  canOpenLesson,
  getLessonNeighbours,
  type LessonNeighbours,
} from "@/domain/learning-path/lesson-access";
import type { LessonProgressRepository } from "@/domain/user/repositories/lesson-progress-repository";

export type LessonAccessDependencies = {
  lessonRepository: Pick<LessonRepository, "findById" | "listAll">;
  lessonProgressRepository: Pick<LessonProgressRepository, "findById" | "listByUserId">;
};

export type LessonAccess = {
  lesson: Lesson;
  neighbours: LessonNeighbours;
};

export const getSignedInUserId = () => {
  const userId = requestContext.getUserId();
  if (!userId) throw new UnauthorizedError("Authentication required");
  return userId;
};

export const makeResolveLessonAccess =
  ({ lessonRepository, lessonProgressRepository }: LessonAccessDependencies) =>
  async (userId: string, lessonId: string): Promise<LessonAccess> => {
    const lesson = await lessonRepository.findById(lessonId);
    if (!lesson || lesson.isRetired) throw new NotFoundError("Lesson not found", { lessonId });

    const [lessons, progress] = await Promise.all([
      lessonRepository.listAll(),
      lessonProgressRepository.listByUserId(userId),
    ]);
    const neighbours = getLessonNeighbours(lessons, lessonId);
    if (!neighbours) throw new NotFoundError("Lesson not found", { lessonId });

    const completedLessonIds = new Set(
      progress.filter((row) => row.status === "completed").map((row) => row.lessonId),
    );
    if (!canOpenLesson(lessons, completedLessonIds, lessonId)) {
      throw new ForbiddenError("Lesson is locked", { lessonId });
    }
    return { lesson, neighbours };
  };

export type ResolveLessonAccess = ReturnType<typeof makeResolveLessonAccess>;
