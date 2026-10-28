import type { UserMastery } from "@/domain/user/user-mastery";
import type { UserMastery as UserMasteryRow } from "@/generated/prisma/client";

export const toUserMastery = (row: UserMasteryRow): UserMastery => ({
  userId: row.userId,
  lessonId: row.lessonId,
  rating: row.rating,
  mastery: row.mastery.toNumber(),
  currentDifficulty: row.currentDifficulty,
  updatedAt: row.updatedAt,
});
