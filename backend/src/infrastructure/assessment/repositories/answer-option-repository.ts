import type {
  AnswerOption,
  AnswerOptionChanges,
  NewAnswerOption,
} from "@/domain/assessment/answer-option";
import type { AnswerOptionRepository } from "@/domain/assessment/repositories/answer-option-repository";
import type {
  AnswerOption as AnswerOptionRow,
  Prisma,
  PrismaClient,
} from "@/generated/prisma/client";
import { toAnswerOption } from "@/infrastructure/assessment/mappers/answer-option-mapper";
import { PrismaRepository } from "@/infrastructure/database/prisma-repository";

type AnswerOptionModel = {
  row: AnswerOptionRow;
  where: Prisma.AnswerOptionWhereUniqueInput;
  create: Prisma.AnswerOptionUncheckedCreateInput;
  update: Prisma.AnswerOptionUncheckedUpdateInput;
  orderBy: Prisma.AnswerOptionOrderByWithRelationInput;
};

export class PrismaAnswerOptionRepository
  extends PrismaRepository<AnswerOptionModel, AnswerOption, NewAnswerOption, AnswerOptionChanges>
  implements AnswerOptionRepository
{
  constructor(client: PrismaClient) {
    super(client, client.answerOption, {
      toEntity: toAnswerOption,
      toWhere: (id) => ({ id }),
      orderBy: [{ questionId: "asc" }],
      toCreateData: (answerOption) => answerOption,
      toUpdateData: (changes) => changes,
    });
  }
}
