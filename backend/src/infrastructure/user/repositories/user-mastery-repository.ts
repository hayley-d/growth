import type { UserMasteryRepository } from "@/domain/user/repositories/user-mastery-repository";
import type {
  NewUserMastery,
  UserMastery,
  UserMasteryChanges,
  UserMasteryKey,
} from "@/domain/user/user-mastery";
import type {
  Prisma,
  PrismaClient,
  UserMastery as UserMasteryRow,
} from "@/generated/prisma/client";
import { PrismaRepository } from "@/infrastructure/database/prisma-repository";
import { toUserMastery } from "@/infrastructure/user/mappers/user-mastery-mapper";

type UserMasteryModel = {
  row: UserMasteryRow;
  where: Prisma.UserMasteryWhereUniqueInput;
  create: Prisma.UserMasteryUncheckedCreateInput;
  update: Prisma.UserMasteryUncheckedUpdateInput;
  orderBy: Prisma.UserMasteryOrderByWithRelationInput;
};

export class PrismaUserMasteryRepository
  extends PrismaRepository<
    UserMasteryModel,
    UserMastery,
    NewUserMastery,
    UserMasteryChanges,
    UserMasteryKey
  >
  implements UserMasteryRepository
{
  constructor(client: PrismaClient) {
    super(client, client.userMastery, {
      toEntity: toUserMastery,
      toWhere: (key) => ({ userId_lessonId: key }),
      orderBy: [{ userId: "asc" }, { lessonId: "asc" }],
      toCreateData: (userMastery) => userMastery,
      toUpdateData: (changes) => changes,
    });
  }
}
