import type {
  LearningStyle,
  LearningStyleChanges,
  NewLearningStyle,
} from "@/domain/course-content/learning-style";
import type { LearningStyleRepository } from "@/domain/course-content/repositories/learning-style-repository";
import type {
  LearningStyle as LearningStyleRow,
  Prisma,
  PrismaClient,
} from "@/generated/prisma/client";
import { toLearningStyle } from "@/infrastructure/course-content/mappers/learning-style-mapper";
import { PrismaRepository } from "@/infrastructure/database/prisma-repository";

type LearningStyleModel = {
  row: LearningStyleRow;
  where: Prisma.LearningStyleWhereUniqueInput;
  create: Prisma.LearningStyleUncheckedCreateInput;
  update: Prisma.LearningStyleUncheckedUpdateInput;
  orderBy: Prisma.LearningStyleOrderByWithRelationInput;
};

export class PrismaLearningStyleRepository
  extends PrismaRepository<
    LearningStyleModel,
    LearningStyle,
    NewLearningStyle,
    LearningStyleChanges
  >
  implements LearningStyleRepository
{
  constructor(client: PrismaClient) {
    super(client, client.learningStyle, {
      toEntity: toLearningStyle,
      toWhere: (id) => ({ id }),
      orderBy: [{ id: "asc" }],
      toCreateData: (learningStyle) => learningStyle,
      toUpdateData: (changes) => changes,
    });
  }

  findByName(name: string) {
    return this.findOne({ name });
  }
}
