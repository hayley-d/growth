import { requestContext } from "@/application/context/request-context";
import type { AssessmentAttemptRepository } from "@/domain/assessment/repositories/assessment-attempt-repository";
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
  lessonProgressRepository: Pick<LessonProgressRepository, "findById">;
  assessmentAttemptRepository: Pick<AssessmentAttemptRepository, "hasPassedForLesson">;
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
  ({
    lessonRepository,
    lessonProgressRepository,
    assessmentAttemptRepository,
  }: LessonAccessDependencies) =>
  async (userId: string, lessonId: string): Promise<LessonAccess> => {
    const lesson = await lessonRepository.findById(lessonId);
    if (!lesson) throw new NotFoundError("Lesson not found", { lessonId });

    const neighbours = getLessonNeighbours(await lessonRepository.listAll(), lessonId);
    if (!neighbours) throw new NotFoundError("Lesson not found", { lessonId });

    const { previousLessonId } = neighbours;
    const previous = previousLessonId
      ? {
          completed:
            (await lessonProgressRepository.findById({ userId, lessonId: previousLessonId }))
              ?.status === "completed",
          testPassed: await assessmentAttemptRepository.hasPassedForLesson(
            userId,
            previousLessonId,
          ),
        }
      : null;

    if (!canOpenLesson(neighbours, previous)) {
      throw new ForbiddenError("Lesson is locked", { lessonId });
    }
    return { lesson, neighbours };
  };

export type ResolveLessonAccess = ReturnType<typeof makeResolveLessonAccess>;
