import type { NewQuestion, Question, QuestionChanges } from "@/domain/assessment/question";
import type { QuestionRepository } from "@/domain/assessment/repositories/question-repository";
import type { Prisma, PrismaClient, Question as QuestionRow } from "@/generated/prisma/client";
import {
  toQuestion,
  toQuestionCreateData,
  toQuestionUpdateData,
} from "@/infrastructure/assessment/mappers/question-mapper";
import { PrismaRepository } from "@/infrastructure/database/prisma-repository";

type QuestionModel = {
  row: QuestionRow;
  where: Prisma.QuestionWhereUniqueInput;
  create: Prisma.QuestionUncheckedCreateInput;
  update: Prisma.QuestionUncheckedUpdateInput;
  orderBy: Prisma.QuestionOrderByWithRelationInput;
};

export class PrismaQuestionRepository
  extends PrismaRepository<QuestionModel, Question, NewQuestion, QuestionChanges>
  implements QuestionRepository
{
  constructor(client: PrismaClient) {
    super(client, client.question, {
      toEntity: toQuestion,
      toWhere: (id) => ({ id }),
      orderBy: [{ lessonId: "asc" }, { difficulty: "asc" }],
      toCreateData: toQuestionCreateData,
      toUpdateData: toQuestionUpdateData,
    });
  }
}
