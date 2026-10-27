import type { UserRepository } from "@/domain/user/repositories/user-repository";
import type { NewUser, User, UserChanges } from "@/domain/user/user";
import type { Prisma, PrismaClient, User as UserRow } from "@/generated/prisma/client";
import { PrismaRepository } from "@/infrastructure/database/prisma-repository";
import {
  toUser,
  toUserCreateData,
  toUserUpdateData,
} from "@/infrastructure/user/mappers/user-mapper";

type UserModel = {
  row: UserRow;
  where: Prisma.UserWhereUniqueInput;
  create: Prisma.UserUncheckedCreateInput;
  update: Prisma.UserUncheckedUpdateInput;
  orderBy: Prisma.UserOrderByWithRelationInput;
};

export class PrismaUserRepository
  extends PrismaRepository<UserModel, User, NewUser, UserChanges>
  implements UserRepository
{
  constructor(client: PrismaClient) {
    super(client, client.user, {
      toEntity: toUser,
      toWhere: (id) => ({ id }),
      orderBy: [{ id: "asc" }],
      toCreateData: toUserCreateData,
      toUpdateData: toUserUpdateData,
    });
  }

  findByEmail(email: string) {
    return this.findOne({ email });
  }
}
