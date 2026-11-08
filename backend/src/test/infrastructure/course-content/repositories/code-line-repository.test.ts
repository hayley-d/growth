import { describe, expect, it, vi } from "vitest";

import type { PrismaClient } from "@/generated/prisma/client";
import { PrismaCodeLineRepository } from "@/infrastructure/course-content/repositories";

const row = {
  codeSnippetId: "8d3c1f9e-4b1a-4c55-9d0e-2f6a7b8c9d01",
  stepKey: "insert.compare",
  lineNumber: 3,
};

describe("PrismaCodeLineRepository", () => {
  it("lists the lines of one snippet in line order", async () => {
    const codeLine = { findMany: vi.fn().mockResolvedValue([row]) };
    const client = { codeLine } as unknown as PrismaClient;

    await expect(
      new PrismaCodeLineRepository(client).listByCodeSnippetId(row.codeSnippetId),
    ).resolves.toEqual([row]);
    expect(codeLine.findMany).toHaveBeenCalledWith({
      where: { codeSnippetId: row.codeSnippetId },
      orderBy: [{ codeSnippetId: "asc" }, { lineNumber: "asc" }],
    });
  });

  it("finds a line by its snippet and step key", async () => {
    const codeLine = { findUnique: vi.fn().mockResolvedValue(row) };
    const client = { codeLine } as unknown as PrismaClient;

    await new PrismaCodeLineRepository(client).findById({
      codeSnippetId: row.codeSnippetId,
      stepKey: row.stepKey,
    });
    expect(codeLine.findUnique).toHaveBeenCalledWith({
      where: { codeSnippetId_stepKey: { codeSnippetId: row.codeSnippetId, stepKey: row.stepKey } },
    });
  });
});
