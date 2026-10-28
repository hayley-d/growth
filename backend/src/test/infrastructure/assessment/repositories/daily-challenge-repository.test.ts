import { describe, expect, it, vi } from "vitest";

import type { PrismaClient } from "@/generated/prisma/client";
import { PrismaDailyChallengeRepository } from "@/infrastructure/assessment/repositories";

const row = {
  id: "8d3c1f9e-4b1a-4c55-9d0e-2f6a7b8c9d01",
  date: new Date("2026-10-28T00:00:00.000Z"),
  questionId: "1b2c3d4e-5f60-4718-9a2b-3c4d5e6f7a80",
  seed: 7,
};

describe("PrismaDailyChallengeRepository", () => {
  it("finds a daily challenge by its date", async () => {
    const dailyChallenge = { findUnique: vi.fn().mockResolvedValue(row) };
    const client = { dailyChallenge } as unknown as PrismaClient;

    const found = await new PrismaDailyChallengeRepository(client).findByDate(row.date);

    expect(dailyChallenge.findUnique).toHaveBeenCalledWith({ where: { date: row.date } });
    expect(found).toEqual(row);
  });
});
