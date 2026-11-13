import { describe, expect, it } from "vitest";

import {
  describeDuration,
  formatDuration,
  secondsBetween,
} from "@/lib/daily-challenge/format-duration";

describe("formatDuration", () => {
  it.each([
    [0, "0:00"],
    [5, "0:05"],
    [65, "1:05"],
    [3599, "59:59"],
    [3600, "1:00:00"],
    [79_199, "21:59:59"],
  ])("shows %i seconds as %s", (seconds, expected) => {
    expect(formatDuration(seconds)).toBe(expected);
  });

  it("never shows a negative time", () => {
    expect(formatDuration(-4)).toBe("0:00");
  });
});

describe("describeDuration", () => {
  it.each([
    [0, "0 seconds"],
    [1, "1 second"],
    [65, "1 minute 5 seconds"],
    [7_260, "2 hours 1 minute"],
  ])("reads %i seconds as %s", (seconds, expected) => {
    expect(describeDuration(seconds)).toBe(expected);
  });
});

describe("secondsBetween", () => {
  it("counts whole seconds and stops at zero", () => {
    expect(secondsBetween(1_000, 66_900)).toBe(65);
    expect(secondsBetween(5_000, 1_000)).toBe(0);
  });
});
