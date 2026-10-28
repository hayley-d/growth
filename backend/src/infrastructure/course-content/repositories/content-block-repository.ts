import type {
  ContentBlock,
  ContentBlockChanges,
  NewContentBlock,
} from "@/domain/course-content/content-block";
import type { ContentBlockRepository } from "@/domain/course-content/repositories/content-block-repository";
import type {
  ContentBlock as ContentBlockRow,
  Prisma,
  PrismaClient,
} from "@/generated/prisma/client";
import {
  toContentBlock,
  toContentBlockCreateData,
  toContentBlockUpdateData,
} from "@/infrastructure/course-content/mappers/content-block-mapper";
import { PrismaRepository } from "@/infrastructure/database/prisma-repository";

type ContentBlockModel = {
  row: ContentBlockRow;
  where: Prisma.ContentBlockWhereUniqueInput;
  create: Prisma.ContentBlockUncheckedCreateInput;
  update: Prisma.ContentBlockUncheckedUpdateInput;
  orderBy: Prisma.ContentBlockOrderByWithRelationInput;
};

export class PrismaContentBlockRepository
  extends PrismaRepository<ContentBlockModel, ContentBlock, NewContentBlock, ContentBlockChanges>
  implements ContentBlockRepository
{
  constructor(client: PrismaClient) {
    super(client, client.contentBlock, {
      toEntity: toContentBlock,
      toWhere: (id) => ({ id }),
      orderBy: [{ lessonId: "asc" }, { position: "asc" }],
      toCreateData: toContentBlockCreateData,
      toUpdateData: toContentBlockUpdateData,
    });
  }
}
