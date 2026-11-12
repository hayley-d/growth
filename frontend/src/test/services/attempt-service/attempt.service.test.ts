import { beforeEach, describe, expect, it, vi } from "vitest";

import { attemptService } from "@/services/attempt-service/attempt.service";
import { networkService } from "@/services/network.service";
import { ServiceError } from "@/services/service-error";

vi.mock("@/services/network.service", () => ({
  networkService: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

const mockedPost = vi.mocked(networkService.post);

const id = "8d3c1f9e-4b1a-4c55-9d0e-2f6a7b8c9d01";
const attempt = {
  id,
  lessonId: id,
  kind: "lesson_test",
  topic: null,
  status: "in_progress",
  total: 5,
  answeredCount: 0,
  startedAt: "2026-11-11T10:00:00.000Z",
  finishedAt: null,
};
const question = {
  id,
  position: 1,
  type: "text",
  prompt: "Name the traversal.",
  tree: null,
  difficulty: 1,
  hints: [],
  hintsTotal: 3,
  hintsRemaining: 3,
};
const stateResponse = { data: { attempt, question, result: null } };
const hintResponse = {
  data: { questionId: id, hint: "Root first.", hintNumber: 1, hintsRemaining: 2 },
};
const answerResponse = {
  data: {
    isCorrect: true,
    correctAnswer: { type: "text", text: "pre-order" },
    explanation: "Root first.",
    replay: null,
    hintsUsed: 0,
    points: 100,
    rating: { before: 1000, after: 1010 },
    attempt,
    question: null,
    result: null,
  },
};
const serverFailure = {
  statusCode: 409,
  message: "Request failed with status code 409",
  serverError: { message: "Attempt is finished" },
};

beforeEach(() => {
  mockedPost.mockReset();
});

describe("attemptService.startAttempt", () => {
  it("returns the parsed attempt state", async () => {
    mockedPost.mockResolvedValue({ data: stateResponse });

    await expect(attemptService.startAttempt(id)).resolves.toEqual(stateResponse);
    expect(mockedPost).toHaveBeenCalledWith(`/api/lessons/${id}/attempts`);
  });

  it("rejects with a ServiceError when the request fails", async () => {
    mockedPost.mockRejectedValue(serverFailure);

    const error = await attemptService.startAttempt(id).catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(ServiceError);
    expect(error).toMatchObject({ status: 409, message: "Attempt is finished" });
  });

  it("rejects when the response has the wrong shape", async () => {
    mockedPost.mockResolvedValue({ data: { data: { attempt } } });

    await expect(attemptService.startAttempt(id)).rejects.toMatchObject({
      message: "Incorrect data format",
    });
  });
});

describe("attemptService.requestHint", () => {
  it("posts the question id and returns the hint", async () => {
    mockedPost.mockResolvedValue({ data: hintResponse });

    await expect(attemptService.requestHint(id, id)).resolves.toEqual(hintResponse);
    expect(mockedPost).toHaveBeenCalledWith(`/api/attempts/${id}/hints`, { questionId: id });
  });

  it("rejects with a ServiceError when the request fails", async () => {
    mockedPost.mockRejectedValue(serverFailure);

    await expect(attemptService.requestHint(id, id)).rejects.toMatchObject({
      status: 409,
      message: "Attempt is finished",
    });
  });

  it("rejects when the response has the wrong shape", async () => {
    mockedPost.mockResolvedValue({ data: { data: { hint: 1 } } });

    await expect(attemptService.requestHint(id, id)).rejects.toMatchObject({
      message: "Incorrect data format",
    });
  });
});

describe("attemptService.submitAnswer", () => {
  const answer = { type: "text", text: "pre-order" } as const;

  it("posts the answer and returns the feedback", async () => {
    mockedPost.mockResolvedValue({ data: answerResponse });

    await expect(attemptService.submitAnswer(id, id, answer)).resolves.toEqual(answerResponse);
    expect(mockedPost).toHaveBeenCalledWith(`/api/attempts/${id}/answers`, {
      questionId: id,
      answer,
    });
  });

  it("rejects with a ServiceError when the request fails", async () => {
    mockedPost.mockRejectedValue(serverFailure);

    await expect(attemptService.submitAnswer(id, id, answer)).rejects.toMatchObject({
      status: 409,
      message: "Attempt is finished",
    });
  });

  it("rejects when the response has the wrong shape", async () => {
    mockedPost.mockResolvedValue({ data: { data: { isCorrect: true } } });

    await expect(attemptService.submitAnswer(id, id, answer)).rejects.toMatchObject({
      message: "Incorrect data format",
    });
  });
});
