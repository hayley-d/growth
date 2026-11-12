import { describe, expect, it } from "vitest";

import { type DailyChallengeResult, rankLeaderboard } from "@/domain/leaderboard/rank-leaderboard";

const dayStart = new Date("2026-11-11T22:00:00.000Z");

const result = (
  userId: string,
  displayName: string,
  timeSeconds: number,
  showOnLeaderboard = true,
  extraMilliseconds = 0,
): DailyChallengeResult => ({
  userId,
  displayName,
  showOnLeaderboard,
  finishedAt: new Date(dayStart.getTime() + timeSeconds * 1000 + extraMilliseconds),
});

describe("rankLeaderboard", () => {
  it("ranks the fastest finish first", () => {
    const results = [result("c", "Cy", 30), result("a", "Ada", 10), result("b", "Bea", 20)];

    expect(rankLeaderboard(results, "b", dayStart).top).toEqual([
      { rank: 1, displayName: "Ada", timeSeconds: 10 },
      { rank: 2, displayName: "Bea", timeSeconds: 20 },
      { rank: 3, displayName: "Cy", timeSeconds: 30 },
    ]);
  });

  it("gives equal whole seconds the same rank and skips the next", () => {
    const results = [
      result("a", "Ada", 10, true, 200),
      result("b", "Bea", 10, true, 800),
      result("c", "Cy", 11),
    ];

    expect(rankLeaderboard(results, "a", dayStart)).toEqual({
      top: [
        { rank: 1, displayName: "Ada", timeSeconds: 10 },
        { rank: 1, displayName: "Bea", timeSeconds: 10 },
        { rank: 3, displayName: "Cy", timeSeconds: 11 },
      ],
      me: { displayName: "Ada", rank: 1, timeSeconds: 10, hidden: false },
    });
  });

  it("leaves opted-out learners out of the top", () => {
    const results = [
      result("hidden", "Hidden", 5, false),
      result("a", "Ada", 10),
      result("b", "Bea", 20),
    ];

    expect(rankLeaderboard(results, "a", dayStart).top).toEqual([
      { rank: 1, displayName: "Ada", timeSeconds: 10 },
      { rank: 2, displayName: "Bea", timeSeconds: 20 },
    ]);
  });

  it("hides the signed-in learner with no rank when they opted out", () => {
    const results = [result("me", "Me", 5, false), result("a", "Ada", 10)];

    expect(rankLeaderboard(results, "me", dayStart)).toEqual({
      top: [{ rank: 1, displayName: "Ada", timeSeconds: 10 }],
      me: { displayName: "Me", rank: null, timeSeconds: 5, hidden: true },
    });
  });

  it("returns a null entry when the signed-in learner has not finished", () => {
    expect(rankLeaderboard([result("a", "Ada", 10)], "missing", dayStart)).toEqual({
      top: [{ rank: 1, displayName: "Ada", timeSeconds: 10 }],
      me: null,
    });
  });

  it("keeps each learner's fastest attempt", () => {
    const results = [result("a", "Ada", 40), result("b", "Bea", 15), result("a", "Ada", 8)];

    expect(rankLeaderboard(results, "a", dayStart)).toEqual({
      top: [
        { rank: 1, displayName: "Ada", timeSeconds: 8 },
        { rank: 2, displayName: "Bea", timeSeconds: 15 },
      ],
      me: { displayName: "Ada", rank: 1, timeSeconds: 8, hidden: false },
    });
  });

  it("returns only the top 10", () => {
    const results = Array.from({ length: 12 }, (_, index) =>
      result(`user-${index}`, `Learner ${index}`, index + 1),
    );

    const ranked = rankLeaderboard(results, "user-11", dayStart);

    expect(ranked.top).toHaveLength(10);
    expect(ranked.top[0]).toEqual({ rank: 1, displayName: "Learner 0", timeSeconds: 1 });
    expect(ranked.top[9]).toEqual({ rank: 10, displayName: "Learner 9", timeSeconds: 10 });
    expect(ranked.me).toEqual({
      displayName: "Learner 11",
      rank: 12,
      timeSeconds: 12,
      hidden: false,
    });
  });
});
