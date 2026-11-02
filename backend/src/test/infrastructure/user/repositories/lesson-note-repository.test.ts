import { describe, expect, it, vi } from "vitest";

import type { PrismaClient } from "@/generated/prisma/client";
import { PrismaLessonNoteRepository } from "@/infrastructure/user/repositories";

const row = {
  userId: "user-1",
  lessonId: "1b2c3d4e-5f60-4718-9a2b-3c4d5e6f7a80",
  body: "my words",
  updatedAt: new Date("2026-11-02T10:00:00.000Z"),
};

describe("PrismaLessonNoteRepository", () => {
  it("finds a note by the compound key", async () => {
    const lessonNote = { findUnique: vi.fn().mockResolvedValue(row) };
    const client = { lessonNote } as unknown as PrismaClient;

    const found = await new PrismaLessonNoteRepository(client).findById({
      userId: row.userId,
      lessonId: row.lessonId,
    });

    expect(lessonNote.findUnique).toHaveBeenCalledWith({
      where: { userId_lessonId: { userId: row.userId, lessonId: row.lessonId } },
    });
    expect(found).toEqual(row);
  });
});
