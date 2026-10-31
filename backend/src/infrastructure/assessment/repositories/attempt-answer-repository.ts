import type {
  AttemptAnswer,
  AttemptAnswerChanges,
  NewAttemptAnswer,
} from "@/domain/assessment/attempt-answer";
import type { AttemptAnswerRepository } from "@/domain/assessment/repositories/attempt-answer-repository";
import type {
  AttemptAnswer as AttemptAnswerRow,
  Prisma,
  PrismaClient,
} from "@/generated/prisma/client";
import {
  toAttemptAnswer,
  toAttemptAnswerCreateData,
  toAttemptAnswerUpdateData,
} from "@/infrastructure/assessment/mappers/attempt-answer-mapper";
import { PrismaRepository } from "@/infrastructure/database/prisma-repository";

type AttemptAnswerModel = {
  row: AttemptAnswerRow;
  where: Prisma.AttemptAnswerWhereUniqueInput;
  create: Prisma.AttemptAnswerUncheckedCreateInput;
  update: Prisma.AttemptAnswerUncheckedUpdateInput;
  orderBy: Prisma.AttemptAnswerOrderByWithRelationInput;
};

export class PrismaAttemptAnswerRepository
  extends PrismaRepository<
    AttemptAnswerModel,
    AttemptAnswer,
    NewAttemptAnswer,
    AttemptAnswerChanges
  >
  implements AttemptAnswerRepository
{
  constructor(client: PrismaClient) {
    super(client, client.attemptAnswer, {
      toEntity: toAttemptAnswer,
      toWhere: (id) => ({ id }),
      orderBy: [{ assessmentAttemptId: "asc" }],
      toCreateData: toAttemptAnswerCreateData,
      toUpdateData: toAttemptAnswerUpdateData,
    });
  }
}
