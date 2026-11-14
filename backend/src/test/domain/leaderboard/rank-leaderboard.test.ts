import { describe, expect, it } from "vitest";

import { type DailyChallengeResult, rankLeaderboard } from "@/domain/leaderboard/rank-leaderboard";

const startedAt = new Date("2026-11-12T10:00:00.000Z");

type ResultOptions = {
  points?: number;
  showOnLeaderboard?: boolean;
  passed?: boolean;
  extraMilliseconds?: number;
};

const result = (
  userId: string,
  displayName: string,
  timeSeconds: number,
  {
    points = 100,
    showOnLeaderboard = true,
    passed = true,
    extraMilliseconds = 0,
  }: ResultOptions = {},
): DailyChallengeResult => ({
  userId,
  displayName,
  showOnLeaderboard,
  passed,
  points,
  startedAt,
  finishedAt: new Date(startedAt.getTime() + timeSeconds * 1000 + extraMilliseconds),
});

const entry = (
  rank: number,
  displayName: string,
  timeSeconds: number,
  isMe = false,
  points = 100,
) => ({ rank, displayName, timeSeconds, points, isMe });

describe("rankLeaderboard", () => {
  it("ranks the quickest time taken first", () => {
    const results = [result("c", "Cy", 30), result("a", "Ada", 10), result("b", "Bea", 20)];

    expect(rankLeaderboard(results, "b").top).toEqual([
      entry(1, "Ada", 10),
      entry(2, "Bea", 20, true),
      entry(3, "Cy", 30),
    ]);
  });

  it("ranks by time taken, not by when in the day it finished", () => {
    const early = {
      ...result("early", "Early", 60),
      startedAt: new Date("2026-11-12T01:00:00.000Z"),
      finishedAt: new Date("2026-11-12T01:01:00.000Z"),
    };
    const late = {
      ...result("late", "Late", 20),
      startedAt: new Date("2026-11-12T20:00:00.000Z"),
      finishedAt: new Date("2026-11-12T20:00:20.000Z"),
    };

    expect(rankLeaderboard([early, late], "early").top.map((row) => row.displayName)).toEqual([
      "Late",
      "Early",
    ]);
  });

  it("breaks a time tie with higher points and gives them separate ranks", () => {
    const results = [
      result("a", "Ada", 10, { points: 80 }),
      result("b", "Bea", 10, { points: 100 }),
      result("c", "Cy", 11),
    ];

    expect(rankLeaderboard(results, "a")).toEqual({
      top: [entry(1, "Bea", 10), entry(2, "Ada", 10, true, 80), entry(3, "Cy", 11)],
      me: {
        displayName: "Ada",
        rank: 2,
        timeSeconds: 10,
        points: 80,
        passed: true,
        hidden: false,
      },
    });
  });

  it("gives equal time and points the same rank and skips the next", () => {
    const results = [
      result("a", "Ada", 10, { extraMilliseconds: 200 }),
      result("b", "Bea", 10, { extraMilliseconds: 300 }),
      result("c", "Cy", 11),
    ];

    expect(rankLeaderboard(results, "a").top).toEqual([
      entry(1, "Ada", 10, true),
      entry(1, "Bea", 10),
      entry(3, "Cy", 11),
    ]);
  });

  it("leaves opted-out learners out of the top", () => {
    const results = [
      result("hidden", "Hidden", 5, { showOnLeaderboard: false }),
      result("a", "Ada", 10),
      result("b", "Bea", 20),
    ];

    expect(rankLeaderboard(results, "a").top).toEqual([
      entry(1, "Ada", 10, true),
      entry(2, "Bea", 20),
    ]);
  });

  it("leaves learners who did not pass out of the top", () => {
    const results = [result("failed", "Failed", 5, { passed: false, points: 0 })];

    expect(rankLeaderboard(results, "other").top).toEqual([]);
  });

  it("hides the signed-in learner with no rank when they opted out", () => {
    const results = [result("me", "Me", 5, { showOnLeaderboard: false }), result("a", "Ada", 10)];

    expect(rankLeaderboard(results, "me")).toEqual({
      top: [entry(1, "Ada", 10)],
      me: {
        displayName: "Me",
        rank: null,
        timeSeconds: 5,
        points: 100,
        passed: true,
        hidden: true,
      },
    });
  });

  it("gives the signed-in learner no rank when they did not pass", () => {
    const results = [result("me", "Me", 5, { passed: false, points: 0 }), result("a", "Ada", 10)];

    expect(rankLeaderboard(results, "me")).toEqual({
      top: [entry(1, "Ada", 10)],
      me: {
        displayName: "Me",
        rank: null,
        timeSeconds: 5,
        points: 0,
        passed: false,
        hidden: false,
      },
    });
  });

  it("returns a null entry when the signed-in learner has not finished", () => {
    expect(rankLeaderboard([result("a", "Ada", 10)], "missing")).toEqual({
      top: [entry(1, "Ada", 10)],
      me: null,
    });
  });

  it("returns only the top 10", () => {
    const results = Array.from({ length: 12 }, (_, index) =>
      result(`user-${index}`, `Learner ${index}`, index + 1),
    );

    const ranked = rankLeaderboard(results, "user-11");

    expect(ranked.top).toHaveLength(10);
    expect(ranked.top[0]).toEqual(entry(1, "Learner 0", 1));
    expect(ranked.top[9]).toEqual(entry(10, "Learner 9", 10));
    expect(ranked.me).toEqual({
      displayName: "Learner 11",
      rank: 12,
      timeSeconds: 12,
      points: 100,
      passed: true,
      hidden: false,
    });
  });

  it("marks the signed-in learner when they finish in the top 10", () => {
    const results = [result("a", "Ada", 10), result("me", "Me", 20), result("c", "Cy", 30)];

    expect(rankLeaderboard(results, "me").top).toEqual([
      entry(1, "Ada", 10),
      entry(2, "Me", 20, true),
      entry(3, "Cy", 30),
    ]);
  });

  it("marks no top entry when the signed-in learner finishes outside the top 10", () => {
    const results = Array.from({ length: 11 }, (_, index) =>
      result(`user-${index}`, `Learner ${index}`, index + 1),
    );

    const top = rankLeaderboard(results, "user-10").top;

    expect(top).toHaveLength(10);
    expect(top.map((row) => row.isMe)).toEqual(Array.from({ length: 10 }, () => false));
  });
});
