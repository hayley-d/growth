import { describe, expect, it, vi } from "vitest";

import type { PrismaClient } from "@/generated/prisma/client";
import { PrismaCodeSnippetRepository } from "@/infrastructure/course-content/repositories";

const row = {
  id: "8d3c1f9e-4b1a-4c55-9d0e-2f6a7b8c9d01",
  algorithmId: "1b2c3d4e-5f60-4718-9a2b-3c4d5e6f7a80",
  codeLanguageId: "2c3d4e5f-6071-4829-8b3c-4d5e6f7a8b91",
  source: "function insert(node, key) {}",
};

describe("PrismaCodeSnippetRepository", () => {
  it("finds a code snippet by its algorithm and language", async () => {
    const codeSnippet = { findUnique: vi.fn().mockResolvedValue(row) };
    const client = { codeSnippet } as unknown as PrismaClient;

    const found = await new PrismaCodeSnippetRepository(client).findByAlgorithmIdAndCodeLanguageId(
      row.algorithmId,
      row.codeLanguageId,
    );

    expect(codeSnippet.findUnique).toHaveBeenCalledWith({
      where: {
        algorithmId_codeLanguageId: {
          algorithmId: row.algorithmId,
          codeLanguageId: row.codeLanguageId,
        },
      },
    });
    expect(found).toEqual(row);
  });

  it("lists the snippets for one algorithm", async () => {
    const codeSnippet = { findMany: vi.fn().mockResolvedValue([row]) };
    const client = { codeSnippet } as unknown as PrismaClient;

    await expect(
      new PrismaCodeSnippetRepository(client).listByAlgorithmId(row.algorithmId),
    ).resolves.toEqual([row]);
    expect(codeSnippet.findMany).toHaveBeenCalledWith({
      where: { algorithmId: row.algorithmId },
      orderBy: [{ algorithmId: "asc" }, { codeLanguageId: "asc" }],
    });
  });
});
