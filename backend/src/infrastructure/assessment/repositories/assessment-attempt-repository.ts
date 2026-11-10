import type {
  AssessmentAttempt,
  AssessmentAttemptChanges,
  NewAssessmentAttempt,
} from "@/domain/assessment/assessment-attempt";
import type { AttemptQuestionDraft } from "@/domain/assessment/attempt-question";
import type { AssessmentAttemptRepository } from "@/domain/assessment/repositories/assessment-attempt-repository";
import type {
  AssessmentAttempt as AssessmentAttemptRow,
  Prisma,
  PrismaClient,
} from "@/generated/prisma/client";
import { toAssessmentAttempt } from "@/infrastructure/assessment/mappers/assessment-attempt-mapper";
import { toAttemptQuestionCreateData } from "@/infrastructure/assessment/mappers/attempt-question-mapper";
import { withPrismaErrors } from "@/infrastructure/database/prisma-errors";
import { PrismaRepository } from "@/infrastructure/database/prisma-repository";

type AssessmentAttemptModel = {
  row: AssessmentAttemptRow;
  where: Prisma.AssessmentAttemptWhereUniqueInput;
  create: Prisma.AssessmentAttemptUncheckedCreateInput;
  update: Prisma.AssessmentAttemptUncheckedUpdateInput;
  orderBy: Prisma.AssessmentAttemptOrderByWithRelationInput;
};

export class PrismaAssessmentAttemptRepository
  extends PrismaRepository<
    AssessmentAttemptModel,
    AssessmentAttempt,
    NewAssessmentAttempt,
    AssessmentAttemptChanges
  >
  implements AssessmentAttemptRepository
{
  constructor(client: PrismaClient) {
    super(client, client.assessmentAttempt, {
      toEntity: toAssessmentAttempt,
      toWhere: (id) => ({ id }),
      orderBy: [{ startedAt: "desc" }],
      toCreateData: (assessmentAttempt) => assessmentAttempt,
      toUpdateData: (changes) => changes,
    });
  }

  createWithQuestions(attempt: NewAssessmentAttempt, questions: AttemptQuestionDraft[]) {
    return withPrismaErrors(async () =>
      toAssessmentAttempt(
        await this.client.assessmentAttempt.create({
          data: {
            ...attempt,
            questions: { create: questions.map(toAttemptQuestionCreateData) },
          },
        }),
      ),
    );
  }

  findUnfinishedByLesson(userId: string, lessonId: string) {
    return withPrismaErrors(async () => {
      const row = await this.client.assessmentAttempt.findFirst({
        where: { userId, lessonId, finishedAt: null },
        orderBy: { startedAt: "desc" },
      });
      return row ? toAssessmentAttempt(row) : null;
    });
  }

  hasPassedForLesson(userId: string, lessonId: string) {
    return withPrismaErrors(async () => {
      const attempt = await this.client.assessmentAttempt.findFirst({
        where: { userId, lessonId, passed: true, kind: { in: ["lesson_test", "checkpoint"] } },
        select: { id: true },
      });
      return attempt !== null;
    });
  }
}
