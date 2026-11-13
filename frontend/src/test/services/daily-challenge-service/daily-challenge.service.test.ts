import { beforeEach, describe, expect, it, vi } from "vitest";

import { dailyChallengeService } from "@/services/daily-challenge-service/daily-challenge.service";
import { networkService } from "@/services/network.service";
import { ServiceError } from "@/services/service-error";

vi.mock("@/services/network.service", () => ({
  networkService: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

const mockedGet = vi.mocked(networkService.get);
const mockedPost = vi.mocked(networkService.post);

const stateResponse = {
  data: {
    date: "2026-11-14",
    nextChallengeAt: "2026-11-14T22:00:00.000Z",
    status: "not_started",
    startedAt: null,
    finishedAt: null,
    question: null,
    result: null,
  },
};

const answer = {
  questionId: "30000000-0000-4000-8000-000000000001",
  answer: { type: "text" as const, text: "3" },
};

const conflict = {
  statusCode: 409,
  message: "Request failed with status code 409",
  serverError: { message: "Today's challenge is already answered" },
};

beforeEach(() => {
  mockedGet.mockReset();
  mockedPost.mockReset();
});

describe("dailyChallengeService.getDailyChallenge", () => {
  it("returns today's parsed state", async () => {
    mockedGet.mockResolvedValue({ data: stateResponse });

    await expect(dailyChallengeService.getDailyChallenge()).resolves.toEqual(stateResponse);
    expect(mockedGet).toHaveBeenCalledWith("/api/daily-challenge");
  });

  it("rejects with a ServiceError and the server message when the request fails", async () => {
    mockedGet.mockRejectedValue(conflict);

    const error = await dailyChallengeService
      .getDailyChallenge()
      .catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(ServiceError);
    expect(error).toMatchObject({ status: 409, message: "Today's challenge is already answered" });
  });

  it("rejects a response with the wrong shape", async () => {
    mockedGet.mockResolvedValue({ data: { data: { status: "skipped" } } });

    await expect(dailyChallengeService.getDailyChallenge()).rejects.toMatchObject({
      message: "Incorrect data format",
    });
  });
});

describe("dailyChallengeService.startDailyChallenge", () => {
  it("posts to the start endpoint and returns the parsed state", async () => {
    mockedPost.mockResolvedValue({ data: stateResponse });

    await expect(dailyChallengeService.startDailyChallenge()).resolves.toEqual(stateResponse);
    expect(mockedPost).toHaveBeenCalledWith("/api/daily-challenge/start");
  });

  it("rejects with a ServiceError and the server message when the request fails", async () => {
    mockedPost.mockRejectedValue(conflict);

    const error = await dailyChallengeService
      .startDailyChallenge()
      .catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(ServiceError);
    expect(error).toMatchObject({ status: 409 });
  });

  it("rejects a response with the wrong shape", async () => {
    mockedPost.mockResolvedValue({ data: {} });

    await expect(dailyChallengeService.startDailyChallenge()).rejects.toMatchObject({
      message: "Incorrect data format",
    });
  });
});

describe("dailyChallengeService.submitDailyChallengeAnswer", () => {
  it("sends the answer and returns the parsed state", async () => {
    mockedPost.mockResolvedValue({ data: stateResponse });

    await expect(dailyChallengeService.submitDailyChallengeAnswer(answer)).resolves.toEqual(
      stateResponse,
    );
    expect(mockedPost).toHaveBeenCalledWith("/api/daily-challenge/answers", answer);
  });

  it("rejects with a ServiceError and the server message when the request fails", async () => {
    mockedPost.mockRejectedValue(conflict);

    const error = await dailyChallengeService
      .submitDailyChallengeAnswer(answer)
      .catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(ServiceError);
    expect(error).toMatchObject({ status: 409, message: "Today's challenge is already answered" });
  });

  it("rejects a response with the wrong shape", async () => {
    mockedPost.mockResolvedValue({ data: { data: null } });

    await expect(dailyChallengeService.submitDailyChallengeAnswer(answer)).rejects.toMatchObject({
      message: "Incorrect data format",
    });
  });
});
