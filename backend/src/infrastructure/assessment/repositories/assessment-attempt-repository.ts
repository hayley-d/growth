import type {
  AssessmentAttempt,
  AssessmentAttemptChanges,
  NewAssessmentAttempt,
} from "@/domain/assessment/assessment-attempt";
import type { AssessmentAttemptRepository } from "@/domain/assessment/repositories/assessment-attempt-repository";
import type {
  AssessmentAttempt as AssessmentAttemptRow,
  Prisma,
  PrismaClient,
} from "@/generated/prisma/client";
import { toAssessmentAttempt } from "@/infrastructure/assessment/mappers/assessment-attempt-mapper";
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
}
