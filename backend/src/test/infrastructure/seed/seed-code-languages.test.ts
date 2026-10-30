import { describe, expect, it, vi } from "vitest";

import type { CodeLanguage } from "@/domain/course-content/code-language";
import type { CodeLanguageRepository } from "@/domain/course-content/repositories/code-language-repository";
import { codeLanguages } from "@/infrastructure/seed/reference-data";
import { seedCodeLanguages } from "@/infrastructure/seed/seed-code-languages";

const createInMemoryRepository = (initial: CodeLanguage[] = []) => {
  const rows = new Map(initial.map((row) => [row.id, row]));
  const findByCode = async (code: string) =>
    [...rows.values()].find((row) => row.code === code) ?? null;

  const repository: CodeLanguageRepository = {
    findById: async (id) => rows.get(id) ?? null,
    findByCode,
    list: async () => ({ items: [...rows.values()], total: rows.size }),
    create: async (codeLanguage) => {
      const row = { id: crypto.randomUUID(), ...codeLanguage };
      rows.set(row.id, row);
      return row;
    },
    update: async (id, changes) => {
      const row = { ...(rows.get(id) as CodeLanguage), ...changes };
      rows.set(id, row);
      return row;
    },
    upsertByCode: vi.fn(async (codeLanguage) => {
      const existing = await findByCode(codeLanguage.code);
      const row = { id: existing?.id ?? crypto.randomUUID(), ...codeLanguage };
      rows.set(row.id, row);
      return row;
    }),
    delete: async (id) => {
      rows.delete(id);
    },
  };

  return { repository, rows };
};

describe("seedCodeLanguages", () => {
  it("creates every code language in an empty store", async () => {
    const { repository, rows } = createInMemoryRepository();

    await expect(seedCodeLanguages(repository, codeLanguages)).resolves.toEqual({
      created: 3,
      updated: 0,
      unchanged: 0,
    });
    expect([...rows.values()].map((row) => row.code)).toEqual(
      codeLanguages.map((codeLanguage) => codeLanguage.code),
    );
  });

  it("updates the name of a language that already exists instead of adding another", async () => {
    const { repository, rows } = createInMemoryRepository([
      { id: "rust-id", code: "rust", name: "Old name" },
    ]);

    await expect(seedCodeLanguages(repository, codeLanguages)).resolves.toEqual({
      created: 2,
      updated: 1,
      unchanged: 0,
    });
    expect(rows.get("rust-id")?.name).toBe("Rust");
    expect(rows.size).toBe(3);
  });

  it("writes nothing on a second run", async () => {
    const { repository, rows } = createInMemoryRepository();

    await seedCodeLanguages(repository, codeLanguages);
    vi.mocked(repository.upsertByCode).mockClear();

    await expect(seedCodeLanguages(repository, codeLanguages)).resolves.toEqual({
      created: 0,
      updated: 0,
      unchanged: 3,
    });
    expect(repository.upsertByCode).not.toHaveBeenCalled();
    expect(rows.size).toBe(3);
  });
});
