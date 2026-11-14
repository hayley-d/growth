import { beforeEach, describe, expect, it, vi } from "vitest";

import { leaderboardService } from "@/services/leaderboard-service/leaderboard.service";
import { networkService } from "@/services/network.service";
import { ServiceError } from "@/services/service-error";

vi.mock("@/services/network.service", () => ({
  networkService: {
    get: vi.fn(),
  },
}));

const mockedGet = vi.mocked(networkService.get);

const response = {
  data: {
    top: [{ rank: 1, displayName: "Ada", timeSeconds: 90, isMe: true }],
    me: { displayName: "Ada", rank: 1, timeSeconds: 90, hidden: false },
  },
};

describe("leaderboardService.getLeaderboard", () => {
  beforeEach(() => {
    mockedGet.mockReset();
  });

  it("returns the parsed leaderboard", async () => {
    mockedGet.mockResolvedValue({ data: response });

    await expect(leaderboardService.getLeaderboard()).resolves.toEqual(response);
    expect(mockedGet).toHaveBeenCalledWith("/api/leaderboard");
  });

  it("rejects with a ServiceError when the request fails", async () => {
    mockedGet.mockRejectedValue({
      statusCode: 401,
      message: "Request failed with status code 401",
      serverError: { message: "Not signed in" },
    });

    const error = await leaderboardService.getLeaderboard().catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(ServiceError);
    expect(error).toMatchObject({ status: 401, message: "Not signed in" });
  });

  it("rejects when the response has the wrong shape", async () => {
    mockedGet.mockResolvedValue({ data: { data: { top: "nope" } } });

    await expect(leaderboardService.getLeaderboard()).rejects.toMatchObject({
      message: "Incorrect data format",
    });
  });
});
