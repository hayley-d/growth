import type {
  CodeLanguage,
  CodeLanguageChanges,
  NewCodeLanguage,
} from "@/domain/course-content/code-language";
import type { CodeLanguageRepository } from "@/domain/course-content/repositories/code-language-repository";
import type {
  CodeLanguage as CodeLanguageRow,
  Prisma,
  PrismaClient,
} from "@/generated/prisma/client";
import { toCodeLanguage } from "@/infrastructure/course-content/mappers/code-language-mapper";
import { PrismaRepository } from "@/infrastructure/database/prisma-repository";

type CodeLanguageModel = {
  row: CodeLanguageRow;
  where: Prisma.CodeLanguageWhereUniqueInput;
  create: Prisma.CodeLanguageUncheckedCreateInput;
  update: Prisma.CodeLanguageUncheckedUpdateInput;
  orderBy: Prisma.CodeLanguageOrderByWithRelationInput;
};

export class PrismaCodeLanguageRepository
  extends PrismaRepository<CodeLanguageModel, CodeLanguage, NewCodeLanguage, CodeLanguageChanges>
  implements CodeLanguageRepository
{
  constructor(client: PrismaClient) {
    super(client, client.codeLanguage, {
      toEntity: toCodeLanguage,
      toWhere: (id) => ({ id }),
      orderBy: [{ id: "asc" }],
      toCreateData: (codeLanguage) => codeLanguage,
      toUpdateData: (changes) => changes,
    });
  }

  findByCode(code: string) {
    return this.findOne({ code });
  }

  upsertByCode(codeLanguage: NewCodeLanguage) {
    return this.upsertOne({ code: codeLanguage.code }, codeLanguage, codeLanguage);
  }
}
