import type {
  AttemptAnswer,
  AttemptAnswerChanges,
  NewAttemptAnswer,
} from "@/domain/assessment/attempt-answer";
import type {
  AttemptAnswerRepository,
  RecordAnswerInput,
} from "@/domain/assessment/repositories/attempt-answer-repository";
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
import { withPrismaErrors } from "@/infrastructure/database/prisma-errors";
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

  listByAttemptId(assessmentAttemptId: string) {
    return withPrismaErrors(async () =>
      (
        await this.client.attemptAnswer.findMany({
          where: { assessmentAttemptId },
          orderBy: { id: "asc" },
        })
      ).map(toAttemptAnswer),
    );
  }

  countByUserAndLesson(userId: string, lessonId: string) {
    return withPrismaErrors(() =>
      this.client.attemptAnswer.count({
        where: {
          assessmentAttempt: { userId, kind: { notIn: ["practice", "daily_challenge"] } },
          question: { lessonId },
        },
      }),
    );
  }

  recordAnswer({ answer, mastery }: RecordAnswerInput) {
    return withPrismaErrors(async () => {
      if (!mastery) {
        return toAttemptAnswer(
          await this.client.attemptAnswer.create({ data: toAttemptAnswerCreateData(answer) }),
        );
      }
      const { userId, lessonId, ...values } = mastery;
      const [row] = await this.client.$transaction([
        this.client.attemptAnswer.create({ data: toAttemptAnswerCreateData(answer) }),
        this.client.userMastery.upsert({
          where: { userId_lessonId: { userId, lessonId } },
          create: { userId, lessonId, ...values },
          update: values,
        }),
      ]);
      return toAttemptAnswer(row);
    });
  }
}
