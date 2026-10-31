import type { DailyActivity } from "@/domain/user/daily-activity";
import type { DailyActivity as DailyActivityRow } from "@/generated/prisma/client";

export const toDailyActivity = (row: DailyActivityRow): DailyActivity => ({
  userId: row.userId,
  date: row.date,
  count: row.count,
});
