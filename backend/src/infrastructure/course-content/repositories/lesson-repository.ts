import type { Lesson, LessonChanges, NewLesson } from "@/domain/course-content/lesson";
import type { LessonRepository } from "@/domain/course-content/repositories/lesson-repository";
import type { Lesson as LessonRow, Prisma, PrismaClient } from "@/generated/prisma/client";
import { toLesson } from "@/infrastructure/course-content/mappers/lesson-mapper";
import { withPrismaErrors } from "@/infrastructure/database/prisma-errors";
import { PrismaRepository } from "@/infrastructure/database/prisma-repository";

type LessonModel = {
  row: LessonRow;
  where: Prisma.LessonWhereUniqueInput;
  create: Prisma.LessonUncheckedCreateInput;
  update: Prisma.LessonUncheckedUpdateInput;
  orderBy: Prisma.LessonOrderByWithRelationInput;
};

export class PrismaLessonRepository
  extends PrismaRepository<LessonModel, Lesson, NewLesson, LessonChanges>
  implements LessonRepository
{
  constructor(client: PrismaClient) {
    super(client, client.lesson, {
      toEntity: toLesson,
      toWhere: (id) => ({ id }),
      orderBy: [{ unit: { position: "asc" } }, { position: "asc" }],
      toCreateData: (lesson) => lesson,
      toUpdateData: (changes) => changes,
    });
  }

  findByUnitIdAndPosition(unitId: string, position: number) {
    return this.findOne({ unitId_position: { unitId, position } });
  }

  listAll() {
    return withPrismaErrors(async () =>
      (await this.client.lesson.findMany({ orderBy: this.options.orderBy })).map(toLesson),
    );
  }

  upsertByUnitIdAndPosition(lesson: NewLesson) {
    return this.upsertOne(
      { unitId_position: { unitId: lesson.unitId, position: lesson.position } },
      lesson,
      lesson,
    );
  }
}
