import type { NewCodeLanguage } from "@/domain/course-content/code-language";
import type { CodeLanguageRepository } from "@/domain/course-content/repositories/code-language-repository";
import type { SeedResult } from "@/infrastructure/seed/seed-result";

export async function seedCodeLanguages(
  codeLanguageRepository: CodeLanguageRepository,
  codeLanguages: NewCodeLanguage[],
): Promise<SeedResult> {
  const result: SeedResult = { created: 0, updated: 0, unchanged: 0 };

  for (const codeLanguage of codeLanguages) {
    const existing = await codeLanguageRepository.findByCode(codeLanguage.code);

    if (existing?.name === codeLanguage.name) {
      result.unchanged += 1;
      continue;
    }

    await codeLanguageRepository.upsertByCode(codeLanguage);

    if (existing) {
      result.updated += 1;
    } else {
      result.created += 1;
    }
  }

  return result;
}
