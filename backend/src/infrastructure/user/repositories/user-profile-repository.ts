import type { UserProfileRepository } from "@/domain/user/repositories/user-profile-repository";
import type { NewUserProfile, UserProfile, UserProfileChanges } from "@/domain/user/user-profile";
import type { PrismaClient } from "@/generated/prisma/client";
import { withPrismaErrors } from "@/infrastructure/database/prisma-errors";
import {
  toUserProfile,
  toUserProfileCreateData,
  toUserProfileUpdateData,
} from "@/infrastructure/user/mappers/user-profile-mapper";

export class PrismaUserProfileRepository implements UserProfileRepository {
  constructor(private readonly client: PrismaClient) {}

  findByUserId(userId: string): Promise<UserProfile | null> {
    return withPrismaErrors(async () => {
      const row = await this.client.userProfile.findUnique({ where: { userId } });
      return row ? toUserProfile(row) : null;
    });
  }

  create(userId: string, profile: NewUserProfile): Promise<UserProfile> {
    return withPrismaErrors(async () =>
      toUserProfile(
        await this.client.userProfile.create({ data: toUserProfileCreateData(userId, profile) }),
      ),
    );
  }

  update(userId: string, changes: UserProfileChanges): Promise<UserProfile> {
    return withPrismaErrors(async () =>
      toUserProfile(
        await this.client.userProfile.update({
          where: { userId },
          data: toUserProfileUpdateData(changes),
        }),
      ),
    );
  }

  delete(userId: string): Promise<void> {
    return withPrismaErrors(async () => {
      await this.client.userProfile.delete({ where: { userId } });
    });
  }
}
