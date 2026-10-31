import type { LessonProgress } from "@/domain/user/lesson-progress";
import type { LessonProgress as LessonProgressRow } from "@/generated/prisma/client";

export const toLessonProgress = (row: LessonProgressRow): LessonProgress => ({
  userId: row.userId,
  lessonId: row.lessonId,
  status: row.status,
  completedAt: row.completedAt,
});
