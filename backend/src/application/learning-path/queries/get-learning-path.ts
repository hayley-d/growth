import { type LearningPathResponse, toLearningPathResponse } from "@shared/schemas";
import { getSignedInUserId } from "@/application/lesson/lesson-access";
import type { LessonRepository } from "@/domain/course-content/repositories/lesson-repository";
import type { UnitRepository } from "@/domain/course-content/repositories/unit-repository";
import { getCurrentLesson } from "@/domain/learning-path/current-lesson";
import { getLessonStatuses } from "@/domain/learning-path/lesson-status";
import { getOverallProgress, getUnitProgress } from "@/domain/learning-path/progress-percentage";
import type { LessonProgressRepository } from "@/domain/user/repositories/lesson-progress-repository";
import type { UserMasteryRepository } from "@/domain/user/repositories/user-mastery-repository";

type GetLearningPathDependencies = {
  unitRepository: Pick<UnitRepository, "listAll">;
  lessonRepository: Pick<LessonRepository, "listAll">;
  lessonProgressRepository: Pick<LessonProgressRepository, "listByUserId">;
  userMasteryRepository: Pick<UserMasteryRepository, "listByUserId">;
};

export const makeGetLearningPath =
  ({
    unitRepository,
    lessonRepository,
    lessonProgressRepository,
    userMasteryRepository,
  }: GetLearningPathDependencies) =>
  async (): Promise<LearningPathResponse> => {
    const userId = getSignedInUserId();
    const [units, lessons, progress, masteries] = await Promise.all([
      unitRepository.listAll(),
      lessonRepository.listAll(),
      lessonProgressRepository.listByUserId(userId),
      userMasteryRepository.listByUserId(userId),
    ]);
    const masteryByLessonId = new Map(
      masteries.map((row) => [row.lessonId, Math.round(row.mastery * 100)]),
    );

    const completedLessonIds = new Set(
      progress.filter((row) => row.status === "completed").map((row) => row.lessonId),
    );
    const statuses = getLessonStatuses(lessons, completedLessonIds);
    const unitProgress = new Map(
      getUnitProgress(lessons, completedLessonIds).map((unit) => [unit.unitId, unit.percentage]),
    );

    return toLearningPathResponse({
      units: units.map((unit) => ({
        id: unit.id,
        title: unit.title,
        position: unit.position,
        progress: unitProgress.get(unit.id) ?? 0,
        lessons: statuses
          .filter(({ lesson }) => lesson.unitId === unit.id)
          .map(({ lesson, status }) => ({
            id: lesson.id,
            title: lesson.title,
            summary: lesson.summary,
            kind: lesson.kind,
            position: lesson.position,
            status,
            mastery: masteryByLessonId.get(lesson.id) ?? 0,
          })),
      })),
      progress: getOverallProgress(lessons, completedLessonIds),
      currentLessonId: getCurrentLesson(lessons, completedLessonIds)?.id ?? null,
    });
  };

export type GetLearningPath = ReturnType<typeof makeGetLearningPath>;
