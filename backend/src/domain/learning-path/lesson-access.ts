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

export type PreviousLessonResult = {
  completed: boolean;
  testPassed: boolean;
};

export function canOpenLesson(
  neighbours: LessonNeighbours,
  previous: PreviousLessonResult | null,
): boolean {
  if (neighbours.previousLessonId === null) return true;
  return previous !== null && (previous.completed || previous.testPassed);
}
