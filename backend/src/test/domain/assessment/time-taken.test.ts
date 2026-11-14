import { describe, expect, it } from "vitest";

import { toTimeTakenSeconds } from "@/domain/assessment/time-taken";

const startedAt = new Date("2026-11-12T10:00:00.000Z");

describe("toTimeTakenSeconds", () => {
  it("rounds to whole seconds", () => {
    expect(toTimeTakenSeconds(startedAt, new Date("2026-11-12T10:00:40.400Z"))).toBe(40);
    expect(toTimeTakenSeconds(startedAt, new Date("2026-11-12T10:00:40.500Z"))).toBe(41);
  });

  it("never goes below zero", () => {
    expect(toTimeTakenSeconds(startedAt, new Date("2026-11-12T09:59:59.000Z"))).toBe(0);
  });
});
