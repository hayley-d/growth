import type { LessonWithStatus, PathLesson } from "@/domain/learning-path/path-lesson";

export function getLessonStatuses<Lesson extends PathLesson>(
  lessons: readonly Lesson[],
  completedLessonIds: ReadonlySet<string>,
): LessonWithStatus<Lesson>[] {
  let currentFound = false;

  return lessons.map((lesson) => {
    if (completedLessonIds.has(lesson.id)) {
      return { lesson, status: "completed" };
    }
    if (!currentFound) {
      currentFound = true;
      return { lesson, status: "current" };
    }
    return { lesson, status: "locked" };
  });
}
