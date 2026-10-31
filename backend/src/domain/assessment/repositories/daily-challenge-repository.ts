import type {
  DailyChallenge,
  DailyChallengeChanges,
  NewDailyChallenge,
} from "@/domain/assessment/daily-challenge";
import type { Repository } from "@/domain/common/repository";

export type DailyChallengeRepository = Repository<
  DailyChallenge,
  NewDailyChallenge,
  DailyChallengeChanges
> & {
  findByDate(date: Date): Promise<DailyChallenge | null>;
};
