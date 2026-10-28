import type { UserProfileRepository } from "@/domain/user/repositories/user-profile-repository";
import type { NewUserProfile, UserProfile, UserProfileChanges } from "@/domain/user/user-profile";
import type {
  Prisma,
  PrismaClient,
  UserProfile as UserProfileRow,
} from "@/generated/prisma/client";
import { PrismaRepository } from "@/infrastructure/database/prisma-repository";
import {
  toUserProfile,
  toUserProfileCreateData,
  toUserProfileUpdateData,
} from "@/infrastructure/user/mappers/user-profile-mapper";

type UserProfileModel = {
  row: UserProfileRow;
  where: Prisma.UserProfileWhereUniqueInput;
  create: Prisma.UserProfileUncheckedCreateInput;
  update: Prisma.UserProfileUncheckedUpdateInput;
  orderBy: Prisma.UserProfileOrderByWithRelationInput;
};

export class PrismaUserProfileRepository
  extends PrismaRepository<UserProfileModel, UserProfile, NewUserProfile, UserProfileChanges>
  implements UserProfileRepository
{
  constructor(client: PrismaClient) {
    super(client, client.userProfile, {
      toEntity: toUserProfile,
      toWhere: (userId) => ({ userId }),
      orderBy: [{ userId: "asc" }],
      toCreateData: toUserProfileCreateData,
      toUpdateData: toUserProfileUpdateData,
    });
  }
}
