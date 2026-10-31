import { describe, expect, it, vi } from "vitest";

import type { LearningStyle } from "@/domain/course-content/learning-style";
import type { LearningStyleRepository } from "@/domain/course-content/repositories/learning-style-repository";
import { learningStyles } from "@/infrastructure/seed/reference-data";
import { seedLearningStyles } from "@/infrastructure/seed/seed-learning-styles";

const createInMemoryRepository = (initial: LearningStyle[] = []) => {
  const rows = new Map(initial.map((row) => [row.id, row]));
  const findByName = async (name: string) =>
    [...rows.values()].find((row) => row.name === name) ?? null;

  const repository: LearningStyleRepository = {
    findById: async (id) => rows.get(id) ?? null,
    findByName,
    list: async () => ({ items: [...rows.values()], total: rows.size }),
    create: async (learningStyle) => {
      const row = { id: crypto.randomUUID(), ...learningStyle };
      rows.set(row.id, row);
      return row;
    },
    update: async (id, changes) => {
      const row = { ...(rows.get(id) as LearningStyle), ...changes };
      rows.set(id, row);
      return row;
    },
    upsertByName: vi.fn(async (learningStyle) => {
      const existing = await findByName(learningStyle.name);
      const row = { id: existing?.id ?? crypto.randomUUID(), ...learningStyle };
      rows.set(row.id, row);
      return row;
    }),
    delete: async (id) => {
      rows.delete(id);
    },
  };

  return { repository, rows };
};

describe("seedLearningStyles", () => {
  it("creates every learning style in an empty store", async () => {
    const { repository, rows } = createInMemoryRepository();

    await expect(seedLearningStyles(repository, learningStyles)).resolves.toEqual({
      created: 4,
      updated: 0,
      unchanged: 0,
    });
    expect([...rows.values()].map((row) => row.name)).toEqual(
      learningStyles.map((learningStyle) => learningStyle.name),
    );
  });

  it("updates the description of a style that already exists instead of adding another", async () => {
    const { repository, rows } = createInMemoryRepository([
      { id: "visual-id", name: "Visual", description: "Old description" },
    ]);

    await expect(seedLearningStyles(repository, learningStyles)).resolves.toEqual({
      created: 3,
      updated: 1,
      unchanged: 0,
    });
    expect(rows.get("visual-id")?.description).toBe(learningStyles[0]?.description);
    expect(rows.size).toBe(4);
  });

  it("writes nothing on a second run", async () => {
    const { repository, rows } = createInMemoryRepository();

    await seedLearningStyles(repository, learningStyles);
    vi.mocked(repository.upsertByName).mockClear();

    await expect(seedLearningStyles(repository, learningStyles)).resolves.toEqual({
      created: 0,
      updated: 0,
      unchanged: 4,
    });
    expect(repository.upsertByName).not.toHaveBeenCalled();
    expect(rows.size).toBe(4);
  });
});
