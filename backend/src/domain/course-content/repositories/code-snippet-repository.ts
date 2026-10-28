import type { Repository } from "@/domain/common/repository";
import type {
  CodeSnippet,
  CodeSnippetChanges,
  NewCodeSnippet,
} from "@/domain/course-content/code-snippet";

export type CodeSnippetRepository = Repository<CodeSnippet, NewCodeSnippet, CodeSnippetChanges> & {
  findByAlgorithmIdAndCodeLanguageId(
    algorithmId: string,
    codeLanguageId: string,
  ): Promise<CodeSnippet | null>;
};
