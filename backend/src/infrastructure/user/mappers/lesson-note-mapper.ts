import type { LessonNote } from "@/domain/user/lesson-note";
import type { LessonNote as LessonNoteRow } from "@/generated/prisma/client";

export const toLessonNote = (row: LessonNoteRow): LessonNote => ({
  userId: row.userId,
  lessonId: row.lessonId,
  body: row.body,
  updatedAt: row.updatedAt,
});
