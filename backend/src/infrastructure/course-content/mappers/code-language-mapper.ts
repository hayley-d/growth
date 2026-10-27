import type { CodeLanguage } from "@/domain/course-content/code-language";
import type { CodeLanguage as CodeLanguageRow } from "@/generated/prisma/client";

export const toCodeLanguage = (row: CodeLanguageRow): CodeLanguage => ({
  id: row.id,
  code: row.code,
  name: row.name,
});
