import { describe, expect, it } from "vitest";

import { leaderboardResponseSchema, toLeaderboardResponse } from "@shared/schemas";

const entry = (rank: number, displayName: string, timeSeconds: number) => ({
  rank,
  displayName,
  timeSeconds,
});

const data = {
  top: [entry(1, "Ada", 90), entry(1, "Bea", 90), entry(3, "Cy", 120)],
  me: { displayName: "Ada", rank: 1, timeSeconds: 90, hidden: false },
};

describe("leaderboardResponseSchema", () => {
  it("wraps the board in data", () => {
    expect(toLeaderboardResponse(data)).toEqual({ data });
  });

  it("allows no entry when the learner has not finished", () => {
    expect(toLeaderboardResponse({ top: [], me: null })).toEqual({
      data: { top: [], me: null },
    });
  });

  it("allows a hidden entry with no rank", () => {
    const me = { displayName: "Ada", rank: null, timeSeconds: 90, hidden: true };
    expect(toLeaderboardResponse({ top: [], me })).toEqual({ data: { top: [], me } });
  });

  it("rejects a rank of zero", () => {
    expect(
      leaderboardResponseSchema.safeParse({ data: { ...data, top: [entry(0, "Ada", 90)] } })
        .success,
    ).toBe(false);
  });

  it("rejects more than 10 in the top", () => {
    const top = Array.from({ length: 11 }, (_, index) =>
      entry(index + 1, `Learner ${index}`, index),
    );
    expect(leaderboardResponseSchema.safeParse({ data: { top, me: null } }).success).toBe(false);
  });

  it("rejects a negative time", () => {
    expect(
      leaderboardResponseSchema.safeParse({
        data: { top: [], me: { ...data.me, timeSeconds: -1 } },
      }).success,
    ).toBe(false);
  });
});
