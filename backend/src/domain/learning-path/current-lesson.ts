import type { PathLesson } from "@/domain/learning-path/path-lesson";

export function getCurrentLesson<Lesson extends PathLesson>(
  lessons: readonly Lesson[],
  completedLessonIds: ReadonlySet<string>,
): Lesson | undefined {
  const firstNotCompleted = lessons.find((lesson) => !completedLessonIds.has(lesson.id));
  return firstNotCompleted ?? lessons.at(-1);
}
