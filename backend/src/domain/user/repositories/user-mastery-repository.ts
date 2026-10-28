import type { Repository } from "@/domain/common/repository";
import type {
  NewUserMastery,
  UserMastery,
  UserMasteryChanges,
  UserMasteryKey,
} from "@/domain/user/user-mastery";

export type UserMasteryRepository = Repository<
  UserMastery,
  NewUserMastery,
  UserMasteryChanges,
  UserMasteryKey
>;
