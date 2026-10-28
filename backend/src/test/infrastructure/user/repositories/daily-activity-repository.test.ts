import { describe, expect, it, vi } from "vitest";

import type { PrismaClient } from "@/generated/prisma/client";
import { PrismaDailyActivityRepository } from "@/infrastructure/user/repositories";

const row = {
  userId: "8d3c1f9e-4b1a-4c55-9d0e-2f6a7b8c9d01",
  date: new Date("2026-10-28T00:00:00.000Z"),
  count: 3,
};

describe("PrismaDailyActivityRepository", () => {
  it("finds a day's activity by the compound key", async () => {
    const dailyActivity = { findUnique: vi.fn().mockResolvedValue(row) };
    const client = { dailyActivity } as unknown as PrismaClient;

    const found = await new PrismaDailyActivityRepository(client).findById({
      userId: row.userId,
      date: row.date,
    });

    expect(dailyActivity.findUnique).toHaveBeenCalledWith({
      where: { userId_date: { userId: row.userId, date: row.date } },
    });
    expect(found).toEqual(row);
  });
});
