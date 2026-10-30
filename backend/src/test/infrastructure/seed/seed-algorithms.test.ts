import { describe, expect, it, vi } from "vitest";

import type { Algorithm } from "@/domain/course-content/algorithm";
import type { AlgorithmRepository } from "@/domain/course-content/repositories/algorithm-repository";
import { algorithms } from "@/infrastructure/seed/reference-data";
import { seedAlgorithms } from "@/infrastructure/seed/seed-algorithms";

const createInMemoryRepository = (initial: Algorithm[] = []) => {
  const rows = new Map(initial.map((row) => [row.id, row]));
  const findByCode = async (code: string) =>
    [...rows.values()].find((row) => row.code === code) ?? null;

  const repository: AlgorithmRepository = {
    findById: async (id) => rows.get(id) ?? null,
    findByCode,
    listAll: async () => [...rows.values()],
    list: async () => ({ items: [...rows.values()], total: rows.size }),
    create: async (algorithm) => {
      const row = { id: crypto.randomUUID(), ...algorithm };
      rows.set(row.id, row);
      return row;
    },
    update: async (id, changes) => {
      const row = { ...(rows.get(id) as Algorithm), ...changes };
      rows.set(id, row);
      return row;
    },
    upsertByCode: vi.fn(async (algorithm) => {
      const existing = await findByCode(algorithm.code);
      const row = { id: existing?.id ?? crypto.randomUUID(), ...algorithm };
      rows.set(row.id, row);
      return row;
    }),
    delete: async (id) => {
      rows.delete(id);
    },
  };

  return { repository, rows };
};

describe("seedAlgorithms", () => {
  it("creates every algorithm in an empty store", async () => {
    const { repository, rows } = createInMemoryRepository();

    await expect(seedAlgorithms(repository, algorithms)).resolves.toEqual({
      created: 11,
      updated: 0,
      unchanged: 0,
    });
    expect([...rows.values()].map((row) => row.code)).toEqual(
      algorithms.map((algorithm) => algorithm.code),
    );
  });

  it("updates the name of an algorithm that already exists instead of adding another", async () => {
    const { repository, rows } = createInMemoryRepository([
      { id: "insert-id", code: "insert", name: "Old name" },
    ]);

    await expect(seedAlgorithms(repository, algorithms)).resolves.toEqual({
      created: 10,
      updated: 1,
      unchanged: 0,
    });
    expect(rows.get("insert-id")?.name).toBe("Insert");
    expect(rows.size).toBe(11);
  });

  it("writes nothing on a second run", async () => {
    const { repository } = createInMemoryRepository();

    await seedAlgorithms(repository, algorithms);
    vi.mocked(repository.upsertByCode).mockClear();

    await expect(seedAlgorithms(repository, algorithms)).resolves.toEqual({
      created: 0,
      updated: 0,
      unchanged: 11,
    });
    expect(repository.upsertByCode).not.toHaveBeenCalled();
  });
});
