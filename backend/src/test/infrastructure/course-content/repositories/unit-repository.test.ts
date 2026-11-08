import { describe, expect, it, vi } from "vitest";

import type { PrismaClient } from "@/generated/prisma/client";
import { PrismaUnitRepository } from "@/infrastructure/course-content/repositories";

const row = { id: "1b2c3d4e-5f60-4718-9a2b-3c4d5e6f7a80", title: "Traversals", position: 1 };

describe("PrismaUnitRepository", () => {
  it("lists every unit by position", async () => {
    const unit = { findMany: vi.fn().mockResolvedValue([row]) };
    const client = { unit } as unknown as PrismaClient;

    await expect(new PrismaUnitRepository(client).listAll()).resolves.toEqual([row]);
    expect(unit.findMany).toHaveBeenCalledWith({ orderBy: [{ position: "asc" }] });
  });
});
