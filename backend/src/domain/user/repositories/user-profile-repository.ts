import type { Repository } from "@/domain/common/repository";
import type { NewUserProfile, UserProfile, UserProfileChanges } from "@/domain/user/user-profile";

export type UserProfileRepository = Repository<UserProfile, NewUserProfile, UserProfileChanges>;
