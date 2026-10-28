import { describe, expect, it, vi } from "vitest";

import type { PrismaClient } from "@/generated/prisma/client";
import { PrismaContentBlockRepository } from "@/infrastructure/course-content/repositories";

const row = {
  id: "8d3c1f9e-4b1a-4c55-9d0e-2f6a7b8c9d01",
  lessonId: "1b2c3d4e-5f60-4718-9a2b-3c4d5e6f7a80",
  learningStyleId: null,
  type: "text" as const,
  body: { markdown: "AVL trees stay balanced." },
  transcript: "AVL trees stay balanced.",
  position: 1,
};

describe("PrismaContentBlockRepository", () => {
  it("writes the body through toJsonInput on create", async () => {
    const contentBlock = { create: vi.fn().mockResolvedValue(row) };
    const client = { contentBlock } as unknown as PrismaClient;

    await new PrismaContentBlockRepository(client).create({
      lessonId: row.lessonId,
      type: row.type,
      body: row.body,
      transcript: row.transcript,
      position: row.position,
    });

    expect(contentBlock.create).toHaveBeenCalledWith({
      data: {
        lessonId: row.lessonId,
        type: row.type,
        body: row.body,
        transcript: row.transcript,
        position: row.position,
      },
    });
  });

  it("leaves body out of the update data when it isn't changing", async () => {
    const contentBlock = { update: vi.fn().mockResolvedValue(row) };
    const client = { contentBlock } as unknown as PrismaClient;

    await new PrismaContentBlockRepository(client).update(row.id, { transcript: "Updated" });

    expect(contentBlock.update).toHaveBeenCalledWith({
      where: { id: row.id },
      data: { transcript: "Updated", body: undefined },
    });
  });
});
