import { describe, expect, it, vi } from "vitest";

import type { Lesson } from "@/domain/course-content/lesson";
import type { LessonRepository } from "@/domain/course-content/repositories/lesson-repository";
import type { UnitRepository } from "@/domain/course-content/repositories/unit-repository";
import type { Unit } from "@/domain/course-content/unit";
import { units } from "@/infrastructure/seed/reference-data";
import { seedUnits } from "@/infrastructure/seed/seed-units";

const createInMemoryRepositories = (initialUnits: Unit[] = [], initialLessons: Lesson[] = []) => {
  const unitRows = new Map(initialUnits.map((row) => [row.id, row]));
  const lessonRows = new Map(initialLessons.map((row) => [row.id, row]));
  const findByPosition = async (position: number) =>
    [...unitRows.values()].find((row) => row.position === position) ?? null;
  const findByUnitIdAndPosition = async (unitId: string, position: number) =>
    [...lessonRows.values()].find((row) => row.unitId === unitId && row.position === position) ??
    null;

  const unitRepository: UnitRepository = {
    findById: async (id) => unitRows.get(id) ?? null,
    findByPosition,
    listAll: async () => [...unitRows.values()],
    list: async () => ({ items: [...unitRows.values()], total: unitRows.size }),
    create: async (unit) => {
      const row = { id: crypto.randomUUID(), ...unit };
      unitRows.set(row.id, row);
      return row;
    },
    update: async (id, changes) => {
      const row = { ...(unitRows.get(id) as Unit), ...changes };
      unitRows.set(id, row);
      return row;
    },
    upsertByPosition: vi.fn(async (unit) => {
      const existing = await findByPosition(unit.position);
      const row = { id: existing?.id ?? crypto.randomUUID(), ...unit };
      unitRows.set(row.id, row);
      return row;
    }),
    delete: async (id) => {
      unitRows.delete(id);
    },
  };

  const lessonRepository: LessonRepository = {
    findById: async (id) => lessonRows.get(id) ?? null,
    findByUnitIdAndPosition,
    listAll: async () => [...lessonRows.values()],
    list: async () => ({ items: [...lessonRows.values()], total: lessonRows.size }),
    create: async (lesson) => {
      const row = { id: crypto.randomUUID(), notePrompt: null, ...lesson };
      lessonRows.set(row.id, row);
      return row;
    },
    update: async (id, changes) => {
      const row = { ...(lessonRows.get(id) as Lesson), ...changes };
      lessonRows.set(id, row);
      return row;
    },
    upsertByUnitIdAndPosition: vi.fn(async (lesson) => {
      const existing = await findByUnitIdAndPosition(lesson.unitId, lesson.position);
      const row = {
        id: existing?.id ?? crypto.randomUUID(),
        notePrompt: existing?.notePrompt ?? null,
        ...lesson,
      };
      lessonRows.set(row.id, row);
      return row;
    }),
    delete: async (id) => {
      lessonRows.delete(id);
    },
  };

  return { unitRepository, lessonRepository, unitRows, lessonRows };
};

describe("seedUnits", () => {
  it("creates every unit and lesson in an empty store", async () => {
    const { unitRepository, lessonRepository, unitRows, lessonRows } = createInMemoryRepositories();

    await expect(seedUnits(unitRepository, lessonRepository, units)).resolves.toEqual({
      created: 14,
      updated: 0,
      unchanged: 0,
    });
    expect(unitRows.size).toBe(2);
    expect(lessonRows.size).toBe(12);
  });

  it("puts each lesson in its own unit", async () => {
    const { unitRepository, lessonRepository, unitRows, lessonRows } = createInMemoryRepositories();

    await seedUnits(unitRepository, lessonRepository, units);

    const first = [...unitRows.values()].find((unit) => unit.position === 1);
    const second = [...unitRows.values()].find((unit) => unit.position === 2);
    const titlesIn = (unitId: string) =>
      [...lessonRows.values()].filter((row) => row.unitId === unitId).map((row) => row.title);
    expect(titlesIn(first?.id ?? "")).toHaveLength(6);
    expect(titlesIn(second?.id ?? "")).toContain("AVL final challenge");
  });

  it("updates a lesson that changed instead of adding another", async () => {
    const { unitRepository, lessonRepository, lessonRows } = createInMemoryRepositories(
      [{ id: "unit-1", title: "Binary trees and traversals", position: 1 }],
      [
        {
          id: "lesson-2",
          unitId: "unit-1",
          title: "Old title",
          summary: "Old summary",
          notePrompt: null,
          kind: "lesson",
          position: 2,
        },
      ],
    );

    await expect(seedUnits(unitRepository, lessonRepository, units)).resolves.toEqual({
      created: 12,
      updated: 1,
      unchanged: 1,
    });
    expect(lessonRows.get("lesson-2")?.title).toBe("Pre-order");
    expect(lessonRows.size).toBe(12);
  });

  it("writes nothing on a second run", async () => {
    const { unitRepository, lessonRepository } = createInMemoryRepositories();

    await seedUnits(unitRepository, lessonRepository, units);
    vi.mocked(unitRepository.upsertByPosition).mockClear();
    vi.mocked(lessonRepository.upsertByUnitIdAndPosition).mockClear();

    await expect(seedUnits(unitRepository, lessonRepository, units)).resolves.toEqual({
      created: 0,
      updated: 0,
      unchanged: 14,
    });
    expect(unitRepository.upsertByPosition).not.toHaveBeenCalled();
    expect(lessonRepository.upsertByUnitIdAndPosition).not.toHaveBeenCalled();
  });
});
