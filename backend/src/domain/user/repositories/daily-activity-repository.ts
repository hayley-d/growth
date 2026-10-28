import type { Repository } from "@/domain/common/repository";
import type {
  DailyActivity,
  DailyActivityChanges,
  DailyActivityKey,
  NewDailyActivity,
} from "@/domain/user/daily-activity";

export type DailyActivityRepository = Repository<
  DailyActivity,
  NewDailyActivity,
  DailyActivityChanges,
  DailyActivityKey
>;
