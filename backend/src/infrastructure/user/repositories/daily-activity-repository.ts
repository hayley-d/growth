import type {
  DailyActivity,
  DailyActivityChanges,
  DailyActivityKey,
  NewDailyActivity,
} from "@/domain/user/daily-activity";
import type { DailyActivityRepository } from "@/domain/user/repositories/daily-activity-repository";
import type {
  DailyActivity as DailyActivityRow,
  Prisma,
  PrismaClient,
} from "@/generated/prisma/client";
import { PrismaRepository } from "@/infrastructure/database/prisma-repository";
import { toDailyActivity } from "@/infrastructure/user/mappers/daily-activity-mapper";

type DailyActivityModel = {
  row: DailyActivityRow;
  where: Prisma.DailyActivityWhereUniqueInput;
  create: Prisma.DailyActivityUncheckedCreateInput;
  update: Prisma.DailyActivityUncheckedUpdateInput;
  orderBy: Prisma.DailyActivityOrderByWithRelationInput;
};

export class PrismaDailyActivityRepository
  extends PrismaRepository<
    DailyActivityModel,
    DailyActivity,
    NewDailyActivity,
    DailyActivityChanges,
    DailyActivityKey
  >
  implements DailyActivityRepository
{
  constructor(client: PrismaClient) {
    super(client, client.dailyActivity, {
      toEntity: toDailyActivity,
      toWhere: (key) => ({ userId_date: key }),
      orderBy: [{ userId: "asc" }, { date: "asc" }],
      toCreateData: (dailyActivity) => dailyActivity,
      toUpdateData: (changes) => changes,
    });
  }
}
