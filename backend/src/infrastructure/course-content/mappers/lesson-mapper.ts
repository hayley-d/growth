import type { Lesson } from "@/domain/course-content/lesson";
import type { Lesson as LessonRow } from "@/generated/prisma/client";

export const toLesson = (row: LessonRow): Lesson => ({
  id: row.id,
  unitId: row.unitId,
  title: row.title,
  summary: row.summary,
  kind: row.kind,
  position: row.position,
});
