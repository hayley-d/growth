import type {
  DailyChallenge,
  DailyChallengeChanges,
  NewDailyChallenge,
} from "@/domain/assessment/daily-challenge";
import type { DailyChallengeRepository } from "@/domain/assessment/repositories/daily-challenge-repository";
import type {
  DailyChallenge as DailyChallengeRow,
  Prisma,
  PrismaClient,
} from "@/generated/prisma/client";
import { toDailyChallenge } from "@/infrastructure/assessment/mappers/daily-challenge-mapper";
import { PrismaRepository } from "@/infrastructure/database/prisma-repository";

type DailyChallengeModel = {
  row: DailyChallengeRow;
  where: Prisma.DailyChallengeWhereUniqueInput;
  create: Prisma.DailyChallengeUncheckedCreateInput;
  update: Prisma.DailyChallengeUncheckedUpdateInput;
  orderBy: Prisma.DailyChallengeOrderByWithRelationInput;
};

export class PrismaDailyChallengeRepository
  extends PrismaRepository<
    DailyChallengeModel,
    DailyChallenge,
    NewDailyChallenge,
    DailyChallengeChanges
  >
  implements DailyChallengeRepository
{
  constructor(client: PrismaClient) {
    super(client, client.dailyChallenge, {
      toEntity: toDailyChallenge,
      toWhere: (id) => ({ id }),
      orderBy: [{ date: "desc" }],
      toCreateData: (dailyChallenge) => dailyChallenge,
      toUpdateData: (changes) => changes,
    });
  }

  findByDate(date: Date) {
    return this.findOne({ date });
  }
}
