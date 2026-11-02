import { describe, expect, it } from "vitest";

import {
  lessonNoteBodySchema,
  lessonNoteResponseSchema,
  saveLessonNoteRequestSchema,
} from "@shared/schemas";

describe("lessonNoteBodySchema", () => {
  it("accepts 2000 characters", () => {
    expect(lessonNoteBodySchema.safeParse("a".repeat(2000)).success).toBe(true);
  });

  it("rejects 2001 characters", () => {
    expect(lessonNoteBodySchema.safeParse("a".repeat(2001)).success).toBe(false);
  });

  it("accepts an empty body", () => {
    expect(lessonNoteBodySchema.safeParse("").success).toBe(true);
  });

  it("keeps leading and trailing spaces", () => {
    expect(lessonNoteBodySchema.parse("  hello  ")).toBe("  hello  ");
  });
});

describe("saveLessonNoteRequestSchema", () => {
  it("requires a body", () => {
    expect(saveLessonNoteRequestSchema.safeParse({}).success).toBe(false);
    expect(saveLessonNoteRequestSchema.safeParse({ body: "" }).success).toBe(true);
  });
});

describe("lessonNoteResponseSchema", () => {
  const lessonId = "1b2c3d4e-5f60-4718-9a2b-3c4d5e6f7a80";

  it("accepts a null updatedAt", () => {
    const result = lessonNoteResponseSchema.safeParse({
      data: { lessonId, body: "", updatedAt: null },
    });
    expect(result.success).toBe(true);
  });

  it("accepts an iso updatedAt and rejects anything else", () => {
    const body = { lessonId, body: "x" };
    expect(
      lessonNoteResponseSchema.safeParse({
        data: { ...body, updatedAt: "2026-11-02T10:00:00.000Z" },
      }).success,
    ).toBe(true);
    expect(
      lessonNoteResponseSchema.safeParse({ data: { ...body, updatedAt: "yesterday" } }).success,
    ).toBe(false);
  });
});
