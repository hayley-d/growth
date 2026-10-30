import type { NewAlgorithm } from "@/domain/course-content/algorithm";
import type { AlgorithmRepository } from "@/domain/course-content/repositories/algorithm-repository";
import type { SeedResult } from "@/infrastructure/seed/seed-result";

export async function seedAlgorithms(
  algorithmRepository: AlgorithmRepository,
  algorithms: NewAlgorithm[],
): Promise<SeedResult> {
  const result: SeedResult = { created: 0, updated: 0, unchanged: 0 };

  for (const algorithm of algorithms) {
    const existing = await algorithmRepository.findByCode(algorithm.code);

    if (existing?.name === algorithm.name) {
      result.unchanged += 1;
      continue;
    }

    await algorithmRepository.upsertByCode(algorithm);

    if (existing) {
      result.updated += 1;
    } else {
      result.created += 1;
    }
  }

  return result;
}
