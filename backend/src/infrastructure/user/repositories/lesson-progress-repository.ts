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
import { withPrismaErrors } from "@/infrastructure/database/prisma-errors";
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

  listByUserId(userId: string) {
    return withPrismaErrors(async () =>
      (
        await this.client.lessonProgress.findMany({
          where: { userId },
          orderBy: this.options.orderBy,
        })
      ).map(toLessonProgress),
    );
  }

  start(key: LessonProgressKey) {
    return this.upsertOne({ userId_lessonId: key }, { ...key, status: "started" }, {});
  }

  completeAll(userId: string, lessonIds: readonly string[], completedAt: Date) {
    return withPrismaErrors(async () => {
      await this.client.$transaction([
        this.client.lessonProgress.updateMany({
          where: { userId, lessonId: { in: [...lessonIds] }, status: { not: "completed" } },
          data: { status: "completed", completedAt },
        }),
        this.client.lessonProgress.createMany({
          data: lessonIds.map((lessonId) => ({
            userId,
            lessonId,
            status: "completed",
            completedAt,
          })),
          skipDuplicates: true,
        }),
      ]);
    });
  }
}
