import type {
  LessonNote,
  LessonNoteChanges,
  LessonNoteKey,
  NewLessonNote,
} from "@/domain/user/lesson-note";
import type { LessonNoteRepository } from "@/domain/user/repositories/lesson-note-repository";
import type { LessonNote as LessonNoteRow, Prisma, PrismaClient } from "@/generated/prisma/client";
import { PrismaRepository } from "@/infrastructure/database/prisma-repository";
import { toLessonNote } from "@/infrastructure/user/mappers/lesson-note-mapper";

type LessonNoteModel = {
  row: LessonNoteRow;
  where: Prisma.LessonNoteWhereUniqueInput;
  create: Prisma.LessonNoteUncheckedCreateInput;
  update: Prisma.LessonNoteUncheckedUpdateInput;
  orderBy: Prisma.LessonNoteOrderByWithRelationInput;
};

export class PrismaLessonNoteRepository
  extends PrismaRepository<
    LessonNoteModel,
    LessonNote,
    NewLessonNote,
    LessonNoteChanges,
    LessonNoteKey
  >
  implements LessonNoteRepository
{
  constructor(client: PrismaClient) {
    super(client, client.lessonNote, {
      toEntity: toLessonNote,
      toWhere: (key) => ({ userId_lessonId: key }),
      orderBy: [{ userId: "asc" }, { lessonId: "asc" }],
      toCreateData: (note) => note,
      toUpdateData: (changes) => changes,
    });
  }
}
