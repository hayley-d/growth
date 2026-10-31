import type { Repository } from "@/domain/common/repository";
import type {
  CodeLanguage,
  CodeLanguageChanges,
  NewCodeLanguage,
} from "@/domain/course-content/code-language";

export type CodeLanguageRepository = Repository<
  CodeLanguage,
  NewCodeLanguage,
  CodeLanguageChanges
> & {
  findByCode(code: string): Promise<CodeLanguage | null>;
  upsertByCode(codeLanguage: NewCodeLanguage): Promise<CodeLanguage>;
};
