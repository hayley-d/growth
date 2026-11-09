import { describe, expect, it } from "vitest";

import {
  attemptLength,
  getAttemptScore,
  isPassed,
  passMark,
} from "@/domain/assessment/attempt-score";

describe("attempt score", () => {
  it("uses five questions and an 80 percent pass mark", () => {
    expect(attemptLength).toBe(5);
    expect(passMark).toBe(80);
  });

  it.each([
    [5, 5, 100],
    [4, 5, 80],
    [3, 5, 60],
    [0, 5, 0],
    [1, 3, 33],
    [2, 3, 67],
  ])("scores %i of %i as %i percent", (correct, total, expected) => {
    expect(getAttemptScore(correct, total)).toBe(expected);
  });

  it("scores an empty attempt as 0", () => {
    expect(getAttemptScore(0, 0)).toBe(0);
  });

  it.each([
    [100, true],
    [80, true],
    [79, false],
    [0, false],
  ])("passes %i percent: %s", (score, expected) => {
    expect(isPassed(score)).toBe(expected);
  });
});
