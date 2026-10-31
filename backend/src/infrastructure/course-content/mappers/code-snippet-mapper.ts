import type { CodeSnippet } from "@/domain/course-content/code-snippet";
import type { CodeSnippet as CodeSnippetRow } from "@/generated/prisma/client";

export const toCodeSnippet = (row: CodeSnippetRow): CodeSnippet => ({
  id: row.id,
  algorithmId: row.algorithmId,
  codeLanguageId: row.codeLanguageId,
  source: row.source,
});
