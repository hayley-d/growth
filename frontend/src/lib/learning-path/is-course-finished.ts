import type { LearningPathLesson } from "@shared/schemas";

export const isCourseFinished = (lessons: readonly Pick<LearningPathLesson, "status">[]) =>
  lessons.length > 0 && lessons.every((lesson) => lesson.status === "completed");
