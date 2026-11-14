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
      { rank: 1, displayName: "Ada", timeSeconds: 10, isMe: false },
      { rank: 2, displayName: "Bea", timeSeconds: 20, isMe: true },
      { rank: 3, displayName: "Cy", timeSeconds: 30, isMe: false },
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
        { rank: 1, displayName: "Ada", timeSeconds: 10, isMe: true },
        { rank: 1, displayName: "Bea", timeSeconds: 10, isMe: false },
        { rank: 3, displayName: "Cy", timeSeconds: 11, isMe: false },
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
      { rank: 1, displayName: "Ada", timeSeconds: 10, isMe: true },
      { rank: 2, displayName: "Bea", timeSeconds: 20, isMe: false },
    ]);
  });

  it("hides the signed-in learner with no rank when they opted out", () => {
    const results = [result("me", "Me", 5, false), result("a", "Ada", 10)];

    expect(rankLeaderboard(results, "me", dayStart)).toEqual({
      top: [{ rank: 1, displayName: "Ada", timeSeconds: 10, isMe: false }],
      me: { displayName: "Me", rank: null, timeSeconds: 5, hidden: true },
    });
  });

  it("returns a null entry when the signed-in learner has not finished", () => {
    expect(rankLeaderboard([result("a", "Ada", 10)], "missing", dayStart)).toEqual({
      top: [{ rank: 1, displayName: "Ada", timeSeconds: 10, isMe: false }],
      me: null,
    });
  });

  it("returns only the top 10", () => {
    const results = Array.from({ length: 12 }, (_, index) =>
      result(`user-${index}`, `Learner ${index}`, index + 1),
    );

    const ranked = rankLeaderboard(results, "user-11", dayStart);

    expect(ranked.top).toHaveLength(10);
    expect(ranked.top[0]).toEqual({
      rank: 1,
      displayName: "Learner 0",
      timeSeconds: 1,
      isMe: false,
    });
    expect(ranked.top[9]).toEqual({
      rank: 10,
      displayName: "Learner 9",
      timeSeconds: 10,
      isMe: false,
    });
    expect(ranked.me).toEqual({
      displayName: "Learner 11",
      rank: 12,
      timeSeconds: 12,
      hidden: false,
    });
  });

  it("marks the signed-in learner when they finish in the top 10", () => {
    const results = [result("a", "Ada", 10), result("me", "Me", 20), result("c", "Cy", 30)];

    expect(rankLeaderboard(results, "me", dayStart).top).toEqual([
      { rank: 1, displayName: "Ada", timeSeconds: 10, isMe: false },
      { rank: 2, displayName: "Me", timeSeconds: 20, isMe: true },
      { rank: 3, displayName: "Cy", timeSeconds: 30, isMe: false },
    ]);
  });

  it("marks no top entry when the signed-in learner finishes outside the top 10", () => {
    const results = Array.from({ length: 11 }, (_, index) =>
      result(`user-${index}`, `Learner ${index}`, index + 1),
    );

    const top = rankLeaderboard(results, "user-10", dayStart).top;

    expect(top).toHaveLength(10);
    expect(top.map((entry) => entry.isMe)).toEqual(Array.from({ length: 10 }, () => false));
  });
});
