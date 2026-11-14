import { describe, expect, it, vi } from "vitest";

import { requestContext } from "@/application/context/request-context";
import { makeGetLeaderboard } from "@/application/leaderboard/queries/get-leaderboard";
import { UnauthorizedError } from "@/domain/errors";

const userId = "user-1";

describe("makeGetLeaderboard", () => {
  it.each([
    ["2026-11-12T21:59:59.999Z", "2026-11-12T00:00:00.000Z"],
    ["2026-11-12T22:00:00.000Z", "2026-11-13T00:00:00.000Z"],
  ])("reads today's challenge when now is %s", async (now, challengeDateIso) => {
    const challengeDate = new Date(challengeDateIso);
    const startedAt = new Date("2026-11-12T10:00:00.000Z");
    const listDailyChallengeResults = vi.fn().mockResolvedValue([
      {
        userId,
        displayName: "Ada",
        showOnLeaderboard: true,
        passed: true,
        points: 100,
        startedAt,
        finishedAt: new Date(startedAt.getTime() + 90_000),
      },
    ]);
    const getLeaderboard = makeGetLeaderboard({
      leaderboardRepository: { listDailyChallengeResults },
      clock: { now: () => new Date(now) },
    });

    const response = await requestContext.run({ requestId: "request-1", userId }, () =>
      getLeaderboard(),
    );

    expect(listDailyChallengeResults).toHaveBeenCalledWith(challengeDate);
    expect(response).toEqual({
      data: {
        top: [{ rank: 1, displayName: "Ada", timeSeconds: 90, points: 100, isMe: true }],
        me: {
          displayName: "Ada",
          rank: 1,
          timeSeconds: 90,
          points: 100,
          passed: true,
          hidden: false,
        },
      },
    });
  });

  it("throws when nobody is signed in", async () => {
    const listDailyChallengeResults = vi.fn();
    const getLeaderboard = makeGetLeaderboard({
      leaderboardRepository: { listDailyChallengeResults },
      clock: { now: () => new Date("2026-11-12T12:00:00.000Z") },
    });

    await expect(
      requestContext.run({ requestId: "request-1" }, () => getLeaderboard()),
    ).rejects.toBeInstanceOf(UnauthorizedError);
    expect(listDailyChallengeResults).not.toHaveBeenCalled();
  });
});
