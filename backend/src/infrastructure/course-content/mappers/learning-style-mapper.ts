import type { LearningStyle } from "@/domain/course-content/learning-style";
import type { LearningStyle as LearningStyleRow } from "@/generated/prisma/client";

export const toLearningStyle = (row: LearningStyleRow): LearningStyle => ({
  id: row.id,
  name: row.name,
  description: row.description,
});
