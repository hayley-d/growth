import { describe, expect, it, vi } from "vitest";

import type { PrismaClient } from "@/generated/prisma/client";
import { PrismaCodeLanguageRepository } from "@/infrastructure/course-content/repositories";

const row = {
  id: "8d3c1f9e-4b1a-4c55-9d0e-2f6a7b8c9d01",
  code: "python",
  name: "Python",
};

describe("PrismaCodeLanguageRepository", () => {
  it("finds a code language by its unique code", async () => {
    const codeLanguage = { findUnique: vi.fn().mockResolvedValue(row) };
    const client = { codeLanguage } as unknown as PrismaClient;
    await expect(new PrismaCodeLanguageRepository(client).findByCode("python")).resolves.toEqual(
      row,
    );
    expect(codeLanguage.findUnique).toHaveBeenCalledWith({ where: { code: "python" } });
  });
});
