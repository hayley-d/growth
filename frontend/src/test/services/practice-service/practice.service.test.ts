import { beforeEach, describe, expect, it, vi } from "vitest";

import { networkService } from "@/services/network.service";
import { practiceService } from "@/services/practice-service/practice.service";
import { ServiceError } from "@/services/service-error";

vi.mock("@/services/network.service", () => ({
  networkService: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

const mockedGet = vi.mocked(networkService.get);
const mockedPost = vi.mocked(networkService.post);

const id = "8d3c1f9e-4b1a-4c55-9d0e-2f6a7b8c9d01";
const attempt = {
  id,
  lessonId: null,
  kind: "practice",
  topic: "traversals",
  status: "in_progress",
  total: 1,
  answeredCount: 0,
  startedAt: "2026-11-12T10:00:00.000Z",
  finishedAt: null,
};
const question = {
  id,
  position: 1,
  type: "order_nodes",
  prompt: "List the nodes.",
  tree: "2,1,#,#,3,#,#",
  difficulty: 1,
  hints: [],
  hintsTotal: 3,
  hintsRemaining: 3,
};
const stateResponse = { data: { attempt, question, result: null } };
const topicsResponse = {
  data: [
    { topic: "traversals", available: true },
    { topic: "rotations", available: false },
  ],
};
const summaryResponse = {
  data: {
    answered: 2,
    correct: 1,
    ratingChange: 4,
    lessons: [
      {
        lessonId: id,
        title: "Pre-order",
        ratingBefore: 1000,
        ratingAfter: 1004,
      },
    ],
  },
};
const serverFailure = {
  statusCode: 409,
  message: "Request failed with status code 409",
  serverError: { message: "No questions for this topic yet" },
};

beforeEach(() => {
  mockedGet.mockReset();
  mockedPost.mockReset();
});

describe("practiceService.getPracticeTopics", () => {
  it("returns the parsed topics", async () => {
    mockedGet.mockResolvedValue({ data: topicsResponse });

    await expect(practiceService.getPracticeTopics()).resolves.toEqual(topicsResponse);
    expect(mockedGet).toHaveBeenCalledWith("/api/practice/topics");
  });

  it("rejects with a ServiceError when the request fails", async () => {
    mockedGet.mockRejectedValue(serverFailure);

    const error = await practiceService.getPracticeTopics().catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(ServiceError);
    expect(error).toMatchObject({ status: 409 });
  });

  it("rejects when the response has the wrong shape", async () => {
    mockedGet.mockResolvedValue({ data: { data: [{ topic: "heaps" }] } });

    await expect(practiceService.getPracticeTopics()).rejects.toMatchObject({
      message: "Incorrect data format",
    });
  });
});

describe("practiceService.startPractice", () => {
  it("posts the topic and returns the attempt state", async () => {
    mockedPost.mockResolvedValue({ data: stateResponse });

    await expect(practiceService.startPractice("traversals")).resolves.toEqual(stateResponse);
    expect(mockedPost).toHaveBeenCalledWith("/api/practice/attempts", { topic: "traversals" });
  });

  it("rejects with the server message when the request fails", async () => {
    mockedPost.mockRejectedValue(serverFailure);

    await expect(practiceService.startPractice("rotations")).rejects.toMatchObject({
      status: 409,
      message: "No questions for this topic yet",
    });
  });

  it("rejects when the response has the wrong shape", async () => {
    mockedPost.mockResolvedValue({ data: { data: { attempt } } });

    await expect(practiceService.startPractice("mixed")).rejects.toMatchObject({
      message: "Incorrect data format",
    });
  });
});

describe("practiceService.nextPracticeQuestion", () => {
  it("returns the next question", async () => {
    mockedPost.mockResolvedValue({ data: stateResponse });

    await expect(practiceService.nextPracticeQuestion(id)).resolves.toEqual(stateResponse);
    expect(mockedPost).toHaveBeenCalledWith(`/api/practice/attempts/${id}/questions`);
  });

  it("rejects with a ServiceError when the request fails", async () => {
    mockedPost.mockRejectedValue(serverFailure);

    await expect(practiceService.nextPracticeQuestion(id)).rejects.toMatchObject({ status: 409 });
  });

  it("rejects when the response has the wrong shape", async () => {
    mockedPost.mockResolvedValue({ data: {} });

    await expect(practiceService.nextPracticeQuestion(id)).rejects.toMatchObject({
      message: "Incorrect data format",
    });
  });
});

describe("practiceService.finishPractice", () => {
  it("returns the summary", async () => {
    mockedPost.mockResolvedValue({ data: summaryResponse });

    await expect(practiceService.finishPractice(id)).resolves.toEqual(summaryResponse);
    expect(mockedPost).toHaveBeenCalledWith(`/api/practice/attempts/${id}/finish`);
  });

  it("rejects with a ServiceError when the request fails", async () => {
    mockedPost.mockRejectedValue(serverFailure);

    await expect(practiceService.finishPractice(id)).rejects.toMatchObject({ status: 409 });
  });

  it("rejects when the response has the wrong shape", async () => {
    mockedPost.mockResolvedValue({ data: { data: { answered: "two" } } });

    await expect(practiceService.finishPractice(id)).rejects.toMatchObject({
      message: "Incorrect data format",
    });
  });
});
