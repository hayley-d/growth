import type {
  LessonProgress,
  LessonProgressChanges,
  LessonProgressKey,
  NewLessonProgress,
} from "@/domain/user/lesson-progress";
import type { LessonProgressRepository } from "@/domain/user/repositories/lesson-progress-repository";
import type {
  LessonProgress as LessonProgressRow,
  Prisma,
  PrismaClient,
} from "@/generated/prisma/client";
import { PrismaRepository } from "@/infrastructure/database/prisma-repository";
import { toLessonProgress } from "@/infrastructure/user/mappers/lesson-progress-mapper";

type LessonProgressModel = {
  row: LessonProgressRow;
  where: Prisma.LessonProgressWhereUniqueInput;
  create: Prisma.LessonProgressUncheckedCreateInput;
  update: Prisma.LessonProgressUncheckedUpdateInput;
  orderBy: Prisma.LessonProgressOrderByWithRelationInput;
};

export class PrismaLessonProgressRepository
  extends PrismaRepository<
    LessonProgressModel,
    LessonProgress,
    NewLessonProgress,
    LessonProgressChanges,
    LessonProgressKey
  >
  implements LessonProgressRepository
{
  constructor(client: PrismaClient) {
    super(client, client.lessonProgress, {
      toEntity: toLessonProgress,
      toWhere: (key) => ({ userId_lessonId: key }),
      orderBy: [{ userId: "asc" }, { lessonId: "asc" }],
      toCreateData: (lessonProgress) => lessonProgress,
      toUpdateData: (changes) => changes,
    });
  }
}
