import type { CaseStudy, CaseStudyChanges, NewCaseStudy } from "@/domain/course-content/case-study";
import type { CaseStudyRepository } from "@/domain/course-content/repositories/case-study-repository";
import type { CaseStudy as CaseStudyRow, Prisma, PrismaClient } from "@/generated/prisma/client";
import {
  toCaseStudy,
  toCaseStudyCreateData,
  toCaseStudyUpdateData,
} from "@/infrastructure/course-content/mappers/case-study-mapper";
import { PrismaRepository } from "@/infrastructure/database/prisma-repository";

type CaseStudyModel = {
  row: CaseStudyRow;
  where: Prisma.CaseStudyWhereUniqueInput;
  create: Prisma.CaseStudyUncheckedCreateInput;
  update: Prisma.CaseStudyUncheckedUpdateInput;
  orderBy: Prisma.CaseStudyOrderByWithRelationInput;
};

export class PrismaCaseStudyRepository
  extends PrismaRepository<CaseStudyModel, CaseStudy, NewCaseStudy, CaseStudyChanges>
  implements CaseStudyRepository
{
  constructor(client: PrismaClient) {
    super(client, client.caseStudy, {
      toEntity: toCaseStudy,
      toWhere: (id) => ({ id }),
      orderBy: [{ lesson: { position: "asc" } }, { position: "asc" }],
      toCreateData: toCaseStudyCreateData,
      toUpdateData: toCaseStudyUpdateData,
    });
  }
}
