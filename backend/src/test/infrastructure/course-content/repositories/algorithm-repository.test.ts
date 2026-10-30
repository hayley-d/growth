import { describe, expect, it, vi } from "vitest";

import type { PrismaClient } from "@/generated/prisma/client";
import { PrismaAlgorithmRepository } from "@/infrastructure/course-content/repositories";

const row = {
  id: "1b2c3d4e-5f60-4718-9a2b-3c4d5e6f7a80",
  code: "insert",
  name: "Insert",
};

describe("PrismaAlgorithmRepository", () => {
  it("lists every algorithm ordered by code", async () => {
    const algorithm = { findMany: vi.fn().mockResolvedValue([row]) };
    const client = { algorithm } as unknown as PrismaClient;

    await expect(new PrismaAlgorithmRepository(client).listAll()).resolves.toEqual([row]);
    expect(algorithm.findMany).toHaveBeenCalledWith({ orderBy: [{ code: "asc" }] });
  });

  it("upserts an algorithm by its code", async () => {
    const algorithm = { upsert: vi.fn().mockResolvedValue(row) };
    const client = { algorithm } as unknown as PrismaClient;

    await expect(
      new PrismaAlgorithmRepository(client).upsertByCode({ code: "insert", name: "Insert" }),
    ).resolves.toEqual(row);
    expect(algorithm.upsert).toHaveBeenCalledWith({
      where: { code: "insert" },
      create: { code: "insert", name: "Insert" },
      update: { code: "insert", name: "Insert" },
    });
  });
});
