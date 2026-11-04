import { describe, expect, it } from "vitest";

import { getCurrentStreak, getLongestStreak } from "@/domain/activity/streak";

const day = (date: string, count = 1) => ({ date: new Date(`${date}T00:00:00.000Z`), count });
const today = new Date("2026-11-04T00:00:00.000Z");

describe("getCurrentStreak", () => {
  it("is 0 with no activity", () => {
    expect(getCurrentStreak([], today)).toBe(0);
  });

  it("counts back from today when today is active", () => {
    const days = [day("2026-11-02"), day("2026-11-03"), day("2026-11-04")];
    expect(getCurrentStreak(days, today)).toBe(3);
  });

  it("counts back from yesterday when today has no activity yet", () => {
    const days = [day("2026-11-01"), day("2026-11-02"), day("2026-11-03")];
    expect(getCurrentStreak(days, today)).toBe(3);
  });

  it("is 0 when the last active day was before yesterday", () => {
    expect(getCurrentStreak([day("2026-11-02")], today)).toBe(0);
  });

  it("stops at the first gap", () => {
    const days = [day("2026-10-30"), day("2026-11-01"), day("2026-11-02"), day("2026-11-03")];
    expect(getCurrentStreak(days, today)).toBe(3);
  });

  it("ignores days with a count of 0", () => {
    const days = [day("2026-11-03"), day("2026-11-04", 0)];
    expect(getCurrentStreak(days, today)).toBe(1);
  });

  it("does not care about the order of the days", () => {
    const days = [day("2026-11-04"), day("2026-11-02"), day("2026-11-03")];
    expect(getCurrentStreak(days, today)).toBe(3);
  });

  it("counts across a month boundary", () => {
    const days = [day("2026-10-31"), day("2026-11-01")];
    expect(getCurrentStreak(days, new Date("2026-11-01T00:00:00.000Z"))).toBe(2);
  });
});

describe("getLongestStreak", () => {
  it("is 0 with no activity", () => {
    expect(getLongestStreak([])).toBe(0);
  });

  it("is 1 for a single active day", () => {
    expect(getLongestStreak([day("2026-11-04")])).toBe(1);
  });

  it("finds the longest run, not the latest one", () => {
    const days = [
      day("2026-10-01"),
      day("2026-10-02"),
      day("2026-10-03"),
      day("2026-10-04"),
      day("2026-11-03"),
      day("2026-11-04"),
    ];
    expect(getLongestStreak(days)).toBe(4);
  });

  it("breaks a run on a day with a count of 0", () => {
    const days = [day("2026-11-01"), day("2026-11-02", 0), day("2026-11-03"), day("2026-11-04")];
    expect(getLongestStreak(days)).toBe(2);
  });
});
