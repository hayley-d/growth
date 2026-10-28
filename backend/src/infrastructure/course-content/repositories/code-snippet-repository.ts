import type {
  CodeSnippet,
  CodeSnippetChanges,
  NewCodeSnippet,
} from "@/domain/course-content/code-snippet";
import type { CodeSnippetRepository } from "@/domain/course-content/repositories/code-snippet-repository";
import type {
  CodeSnippet as CodeSnippetRow,
  Prisma,
  PrismaClient,
} from "@/generated/prisma/client";
import { toCodeSnippet } from "@/infrastructure/course-content/mappers/code-snippet-mapper";
import { PrismaRepository } from "@/infrastructure/database/prisma-repository";

type CodeSnippetModel = {
  row: CodeSnippetRow;
  where: Prisma.CodeSnippetWhereUniqueInput;
  create: Prisma.CodeSnippetUncheckedCreateInput;
  update: Prisma.CodeSnippetUncheckedUpdateInput;
  orderBy: Prisma.CodeSnippetOrderByWithRelationInput;
};

export class PrismaCodeSnippetRepository
  extends PrismaRepository<CodeSnippetModel, CodeSnippet, NewCodeSnippet, CodeSnippetChanges>
  implements CodeSnippetRepository
{
  constructor(client: PrismaClient) {
    super(client, client.codeSnippet, {
      toEntity: toCodeSnippet,
      toWhere: (id) => ({ id }),
      orderBy: [{ algorithmId: "asc" }, { codeLanguageId: "asc" }],
      toCreateData: (codeSnippet) => codeSnippet,
      toUpdateData: (changes) => changes,
    });
  }

  findByAlgorithmIdAndCodeLanguageId(algorithmId: string, codeLanguageId: string) {
    return this.findOne({ algorithmId_codeLanguageId: { algorithmId, codeLanguageId } });
  }
}
