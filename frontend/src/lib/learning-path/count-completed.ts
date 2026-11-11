import type { LearningPathLesson } from "@shared/schemas";

export const countCompleted = (lessons: readonly Pick<LearningPathLesson, "status">[]) =>
  lessons.filter((lesson) => lesson.status === "completed").length;
