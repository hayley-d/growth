import type { PathLesson } from "@/domain/learning-path/path-lesson";

export type UnitProgress = {
  readonly unitId: string;
  readonly percentage: number;
};

function toPercentage(completedCount: number, totalCount: number): number {
  if (totalCount === 0) {
    return 0;
  }
  return Math.floor((completedCount / totalCount) * 100);
}

export function getOverallProgress(
  lessons: readonly PathLesson[],
  completedLessonIds: ReadonlySet<string>,
): number {
  const completedCount = lessons.filter((lesson) => completedLessonIds.has(lesson.id)).length;
  return toPercentage(completedCount, lessons.length);
}

export function getUnitProgress(
  lessons: readonly PathLesson[],
  completedLessonIds: ReadonlySet<string>,
): UnitProgress[] {
  const countsByUnitId = new Map<string, { completedCount: number; totalCount: number }>();

  for (const lesson of lessons) {
    const counts = countsByUnitId.get(lesson.unitId) ?? { completedCount: 0, totalCount: 0 };
    counts.totalCount += 1;
    if (completedLessonIds.has(lesson.id)) {
      counts.completedCount += 1;
    }
    countsByUnitId.set(lesson.unitId, counts);
  }

  return Array.from(countsByUnitId, ([unitId, counts]) => ({
    unitId,
    percentage: toPercentage(counts.completedCount, counts.totalCount),
  }));
}
