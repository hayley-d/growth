import type {
  AttemptQuestion,
  AttemptQuestionChanges,
  NewAttemptQuestion,
} from "@/domain/assessment/attempt-question";
import type { AttemptQuestionRepository } from "@/domain/assessment/repositories/attempt-question-repository";
import type {
  AttemptQuestion as AttemptQuestionRow,
  Prisma,
  PrismaClient,
} from "@/generated/prisma/client";
import {
  toAttemptQuestion,
  toAttemptQuestionCreateData,
  toAttemptQuestionUpdateData,
} from "@/infrastructure/assessment/mappers/attempt-question-mapper";
import { withPrismaErrors } from "@/infrastructure/database/prisma-errors";
import { PrismaRepository } from "@/infrastructure/database/prisma-repository";

type AttemptQuestionModel = {
  row: AttemptQuestionRow;
  where: Prisma.AttemptQuestionWhereUniqueInput;
  create: Prisma.AttemptQuestionUncheckedCreateInput;
  update: Prisma.AttemptQuestionUncheckedUpdateInput;
  orderBy: Prisma.AttemptQuestionOrderByWithRelationInput;
};

export class PrismaAttemptQuestionRepository
  extends PrismaRepository<
    AttemptQuestionModel,
    AttemptQuestion,
    NewAttemptQuestion,
    AttemptQuestionChanges
  >
  implements AttemptQuestionRepository
{
  constructor(client: PrismaClient) {
    super(client, client.attemptQuestion, {
      toEntity: toAttemptQuestion,
      toWhere: (id) => ({ id }),
      orderBy: [{ assessmentAttemptId: "asc" }, { position: "asc" }],
      toCreateData: toAttemptQuestionCreateData,
      toUpdateData: toAttemptQuestionUpdateData,
    });
  }

  listByAttemptId(assessmentAttemptId: string) {
    return withPrismaErrors(async () =>
      (
        await this.client.attemptQuestion.findMany({
          where: { assessmentAttemptId },
          orderBy: { position: "asc" },
        })
      ).map(toAttemptQuestion),
    );
  }

  takeHint(id: string, hintsUsed: number) {
    return withPrismaErrors(async () => {
      const { count } = await this.client.attemptQuestion.updateMany({
        where: { id, hintsUsed },
        data: { hintsUsed: hintsUsed + 1 },
      });
      return count === 1;
    });
  }
}
