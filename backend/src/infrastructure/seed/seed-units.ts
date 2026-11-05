import type { LessonRepository } from "@/domain/course-content/repositories/lesson-repository";
import type { UnitRepository } from "@/domain/course-content/repositories/unit-repository";
import type { SeedUnit } from "@/infrastructure/seed/reference-data";
import type { SeedResult } from "@/infrastructure/seed/seed-result";

export async function seedUnits(
  unitRepository: UnitRepository,
  lessonRepository: LessonRepository,
  units: SeedUnit[],
): Promise<SeedResult> {
  const result: SeedResult = { created: 0, updated: 0, unchanged: 0 };

  for (const { lessons, ...newUnit } of units) {
    const existingUnit = await unitRepository.findByPosition(newUnit.position);
    const unit =
      existingUnit?.title === newUnit.title
        ? existingUnit
        : await unitRepository.upsertByPosition(newUnit);

    if (!existingUnit) {
      result.created += 1;
    } else if (existingUnit === unit) {
      result.unchanged += 1;
    } else {
      result.updated += 1;
    }

    for (const seedLesson of lessons) {
      const newLesson = { ...seedLesson, unitId: unit.id };
      const existing = await lessonRepository.findByUnitIdAndPosition(unit.id, newLesson.position);

      if (
        existing?.title === newLesson.title &&
        existing.summary === newLesson.summary &&
        existing.kind === newLesson.kind
      ) {
        result.unchanged += 1;
        continue;
      }

      await lessonRepository.upsertByUnitIdAndPosition(newLesson);

      if (existing) {
        result.updated += 1;
      } else {
        result.created += 1;
      }
    }
  }

  return result;
}
