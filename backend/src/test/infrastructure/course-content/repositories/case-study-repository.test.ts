import { describe, expect, it, vi } from "vitest";

import type { PrismaClient } from "@/generated/prisma/client";
import { PrismaCaseStudyRepository } from "@/infrastructure/course-content/repositories";

const row = {
  id: "8d3c1f9e-4b1a-4c55-9d0e-2f6a7b8c9d01",
  lessonId: "1b2c3d4e-5f60-4718-9a2b-3c4d5e6f7a80",
  title: "Autocomplete",
  scenario: "A search box suggests matches as you type.",
  body: "Autocomplete trees keep every prefix sorted.",
  task: {
    startingKeys: [20, 10, 30],
    allowedOperations: ["insert"],
    instructions: "Insert 25.",
    goal: { kind: "containsKeys", keys: [25] },
  },
  position: 1,
};

describe("PrismaCaseStudyRepository", () => {
  it("writes the task through toJsonInput on create", async () => {
    const caseStudy = { create: vi.fn().mockResolvedValue(row) };
    const client = { caseStudy } as unknown as PrismaClient;

    await new PrismaCaseStudyRepository(client).create({
      lessonId: row.lessonId,
      title: row.title,
      scenario: row.scenario,
      body: row.body,
      task: row.task,
      position: row.position,
    });

    expect(caseStudy.create).toHaveBeenCalledWith({
      data: {
        lessonId: row.lessonId,
        title: row.title,
        scenario: row.scenario,
        body: row.body,
        task: row.task,
        position: row.position,
      },
    });
  });
});
