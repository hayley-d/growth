import { describe, expect, it } from "vitest";

import { toDayNumber } from "@/domain/activity/streak";
import {
  pickChallengeQuestion,
  toChallengeDate,
  toChallengeSeed,
  toNextChallengeAt,
} from "@/domain/assessment/daily-challenge-rotation";

const questions = [{ id: "c" }, { id: "a" }, { id: "b" }];

describe("toChallengeDate", () => {
  it("is still the same day in Johannesburg at 21:59:59 UTC", () => {
    expect(toChallengeDate(new Date("2026-11-13T21:59:59.000Z"))).toEqual(
      new Date("2026-11-13T00:00:00.000Z"),
    );
  });

  it("is the next day in Johannesburg from 22:00 UTC", () => {
    expect(toChallengeDate(new Date("2026-11-13T22:00:00.000Z"))).toEqual(
      new Date("2026-11-14T00:00:00.000Z"),
    );
  });

  it("crosses into a new year at 22:00 UTC on 31 December", () => {
    expect(toChallengeDate(new Date("2026-12-31T22:00:00.000Z"))).toEqual(
      new Date("2027-01-01T00:00:00.000Z"),
    );
  });

  it("gives every instant of one Johannesburg day the same date", () => {
    const morning = toChallengeDate(new Date("2026-11-13T22:00:00.000Z"));
    const evening = toChallengeDate(new Date("2026-11-14T21:59:59.000Z"));

    expect(evening).toEqual(morning);
  });
});

describe("toDayNumber", () => {
  it("counts days from 1 January 1970", () => {
    expect(toDayNumber(new Date("1970-01-01T00:00:00.000Z"))).toBe(0);
    expect(toDayNumber(new Date("2026-11-14T00:00:00.000Z"))).toBe(20771);
  });
});

describe("pickChallengeQuestion", () => {
  it("gives the same day the same question", () => {
    expect(pickChallengeQuestion(questions, 20771)).toEqual(
      pickChallengeQuestion(questions, 20771),
    );
  });

  it("cycles through the questions by id on consecutive days", () => {
    const picked = [0, 1, 2, 3, 4].map((dayNumber) => pickChallengeQuestion(questions, dayNumber));

    expect(picked.map((question) => question?.id)).toEqual(["a", "b", "c", "a", "b"]);
  });

  it("does not depend on the order the questions come in", () => {
    const reversed = [...questions].reverse();

    expect(pickChallengeQuestion(reversed, 20771)).toEqual(pickChallengeQuestion(questions, 20771));
  });

  it("returns null when there are no questions", () => {
    expect(pickChallengeQuestion([], 20771)).toBeNull();
  });
});

describe("toChallengeSeed", () => {
  it("gives the same day the same seed", () => {
    expect(toChallengeSeed(20771)).toBe(toChallengeSeed(20771));
  });

  it("gives consecutive days different seeds", () => {
    expect(toChallengeSeed(20771)).not.toBe(toChallengeSeed(20772));
  });

  it("stays a whole number that fits a signed 32-bit column", () => {
    for (const dayNumber of [0, 1, 20770, 20771, 100_000]) {
      const seed = toChallengeSeed(dayNumber);
      expect(Number.isInteger(seed)).toBe(true);
      expect(seed).toBeGreaterThanOrEqual(0);
      expect(seed).toBeLessThanOrEqual(2 ** 31 - 1);
    }
  });
});

describe("toNextChallengeAt", () => {
  it("is the next midnight in Johannesburg, 22:00 UTC", () => {
    expect(toNextChallengeAt(new Date("2026-11-13T00:00:00.000Z"))).toEqual(
      new Date("2026-11-13T22:00:00.000Z"),
    );
  });

  it("is the moment toChallengeDate moves to the next day", () => {
    const date = toChallengeDate(new Date("2026-11-13T21:59:59.000Z"));
    const next = toNextChallengeAt(date);

    expect(toChallengeDate(new Date(next.getTime() - 1))).toEqual(date);
    expect(toChallengeDate(next)).toEqual(new Date("2026-11-14T00:00:00.000Z"));
  });
});
