import { getLessonStatuses } from "@/domain/learning-path/lesson-status";
import type { PathLesson } from "@/domain/learning-path/path-lesson";

export type LessonNeighbours = {
  previousLessonId: string | null;
  nextLessonId: string | null;
};

export function getLessonNeighbours(
  lessons: readonly PathLesson[],
  lessonId: string,
): LessonNeighbours | null {
  const index = lessons.findIndex((lesson) => lesson.id === lessonId);
  if (index === -1) return null;
  return {
    previousLessonId: lessons[index - 1]?.id ?? null,
    nextLessonId: lessons[index + 1]?.id ?? null,
  };
}

export function canOpenLesson(
  lessons: readonly PathLesson[],
  completedLessonIds: ReadonlySet<string>,
  lessonId: string,
): boolean {
  const entry = getLessonStatuses(lessons, completedLessonIds).find(
    ({ lesson }) => lesson.id === lessonId,
  );
  return entry !== undefined && entry.status !== "locked";
}
