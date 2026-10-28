import type { CodeLine } from "@/domain/course-content/code-line";
import type { CodeLine as CodeLineRow } from "@/generated/prisma/client";

export const toCodeLine = (row: CodeLineRow): CodeLine => ({
  codeSnippetId: row.codeSnippetId,
  stepKey: row.stepKey,
  lineNumber: row.lineNumber,
});
