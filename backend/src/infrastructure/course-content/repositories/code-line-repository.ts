import type {
  CodeLine,
  CodeLineChanges,
  CodeLineKey,
  NewCodeLine,
} from "@/domain/course-content/code-line";
import type { CodeLineRepository } from "@/domain/course-content/repositories/code-line-repository";
import type { CodeLine as CodeLineRow, Prisma, PrismaClient } from "@/generated/prisma/client";
import { toCodeLine } from "@/infrastructure/course-content/mappers/code-line-mapper";
import { PrismaRepository } from "@/infrastructure/database/prisma-repository";

type CodeLineModel = {
  row: CodeLineRow;
  where: Prisma.CodeLineWhereUniqueInput;
  create: Prisma.CodeLineUncheckedCreateInput;
  update: Prisma.CodeLineUncheckedUpdateInput;
  orderBy: Prisma.CodeLineOrderByWithRelationInput;
};

export class PrismaCodeLineRepository
  extends PrismaRepository<CodeLineModel, CodeLine, NewCodeLine, CodeLineChanges, CodeLineKey>
  implements CodeLineRepository
{
  constructor(client: PrismaClient) {
    super(client, client.codeLine, {
      toEntity: toCodeLine,
      toWhere: (key) => ({ codeSnippetId_stepKey: key }),
      orderBy: [{ codeSnippetId: "asc" }, { lineNumber: "asc" }],
      toCreateData: (codeLine) => codeLine,
      toUpdateData: (changes) => changes,
    });
  }
}
