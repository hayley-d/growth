import { NotFoundError } from "@/domain/errors";
import type { PathLesson } from "@/domain/learning-path/path-lesson";

export function completeThrough(lessons: readonly PathLesson[], lessonId: string): string[] {
  const targetIndex = lessons.findIndex((lesson) => lesson.id === lessonId);
  if (targetIndex === -1) {
    throw new NotFoundError("Lesson not found on the learning path", { lessonId });
  }
  return lessons.slice(0, targetIndex + 1).map((lesson) => lesson.id);
}
