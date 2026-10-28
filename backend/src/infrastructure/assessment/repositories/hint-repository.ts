import type { Hint, HintChanges, NewHint } from "@/domain/assessment/hint";
import type { HintRepository } from "@/domain/assessment/repositories/hint-repository";
import type { Hint as HintRow, Prisma, PrismaClient } from "@/generated/prisma/client";
import { toHint } from "@/infrastructure/assessment/mappers/hint-mapper";
import { PrismaRepository } from "@/infrastructure/database/prisma-repository";

type HintModel = {
  row: HintRow;
  where: Prisma.HintWhereUniqueInput;
  create: Prisma.HintUncheckedCreateInput;
  update: Prisma.HintUncheckedUpdateInput;
  orderBy: Prisma.HintOrderByWithRelationInput;
};

export class PrismaHintRepository
  extends PrismaRepository<HintModel, Hint, NewHint, HintChanges>
  implements HintRepository
{
  constructor(client: PrismaClient) {
    super(client, client.hint, {
      toEntity: toHint,
      toWhere: (id) => ({ id }),
      orderBy: [{ questionId: "asc" }, { position: "asc" }],
      toCreateData: (hint) => hint,
      toUpdateData: (changes) => changes,
    });
  }
}
