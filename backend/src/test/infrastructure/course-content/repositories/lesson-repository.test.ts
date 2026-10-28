import { describe, expect, it, vi } from "vitest";

import type { PrismaClient } from "@/generated/prisma/client";
import { PrismaLessonRepository } from "@/infrastructure/course-content/repositories";

const row = {
  id: "8d3c1f9e-4b1a-4c55-9d0e-2f6a7b8c9d01",
  unitId: "1b2c3d4e-5f60-4718-9a2b-3c4d5e6f7a80",
  title: "Insertion",
  summary: "Insert a key into an AVL tree.",
  kind: "lesson" as const,
  position: 1,
};

describe("PrismaLessonRepository", () => {
  it("finds a lesson by its unit and position", async () => {
    const lesson = { findUnique: vi.fn().mockResolvedValue(row) };
    const client = { lesson } as unknown as PrismaClient;

    const found = await new PrismaLessonRepository(client).findByUnitIdAndPosition(
      row.unitId,
      row.position,
    );

    expect(lesson.findUnique).toHaveBeenCalledWith({
      where: { unitId_position: { unitId: row.unitId, position: row.position } },
    });
    expect(found).toEqual(row);
  });
});
