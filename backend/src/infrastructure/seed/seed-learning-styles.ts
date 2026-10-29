import type { NewLearningStyle } from "@/domain/course-content/learning-style";
import type { LearningStyleRepository } from "@/domain/course-content/repositories/learning-style-repository";
import type { SeedResult } from "@/infrastructure/seed/seed-result";

export async function seedLearningStyles(
  learningStyleRepository: LearningStyleRepository,
  learningStyles: NewLearningStyle[],
): Promise<SeedResult> {
  const result: SeedResult = { created: 0, updated: 0, unchanged: 0 };

  for (const learningStyle of learningStyles) {
    const existing = await learningStyleRepository.findByName(learningStyle.name);

    if (existing?.description === learningStyle.description) {
      result.unchanged += 1;
      continue;
    }

    await learningStyleRepository.upsertByName(learningStyle);

    if (existing) {
      result.updated += 1;
    } else {
      result.created += 1;
    }
  }

  return result;
}
