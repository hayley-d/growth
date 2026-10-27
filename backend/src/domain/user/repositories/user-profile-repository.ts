import type { NewUserProfile, UserProfile, UserProfileChanges } from "@/domain/user/user-profile";

export type UserProfileRepository = {
  findByUserId(userId: string): Promise<UserProfile | null>;
  create(userId: string, profile: NewUserProfile): Promise<UserProfile>;
  update(userId: string, changes: UserProfileChanges): Promise<UserProfile>;
  delete(userId: string): Promise<void>;
};
