import { beforeEach, describe, expect, it, vi } from "vitest";

import { networkService } from "@/services/network.service";
import { onboardingService } from "@/services/onboarding-service";

vi.mock("@/services/network.service", () => ({
  networkService: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

const mockedGet = vi.mocked(networkService.get);
const mockedPost = vi.mocked(networkService.post);

const quizResponse = {
  data: {
    questions: [
      {
        id: "flat-pack-desk",
        prompt: "How?",
        options: ["a", "b", "c", "d"].map((id) => ({ id, text: id })),
      },
    ],
  },
};

const scoreResponse = {
  data: {
    learningStyle: {
      id: "1b2c3d4e-5f60-4718-9a2b-3c4d5e6f7a80",
      name: "Visual",
      description: "Diagrams.",
    },
  },
};

beforeEach(() => {
  mockedGet.mockReset();
  mockedPost.mockReset();
});

describe("onboardingService.getQuiz", () => {
  it("returns the parsed questions", async () => {
    mockedGet.mockResolvedValue({ data: quizResponse });

    await expect(onboardingService.getQuiz()).resolves.toEqual(quizResponse);
    expect(mockedGet).toHaveBeenCalledWith("/api/onboarding/quiz");
  });

  it("rejects when the response has the wrong shape", async () => {
    mockedGet.mockResolvedValue({ data: { data: {} } });

    await expect(onboardingService.getQuiz()).rejects.toMatchObject({
      message: "Incorrect data format",
    });
  });

  it("rejects with the server message when the request fails", async () => {
    mockedGet.mockRejectedValue({ statusCode: 500, serverError: { message: "Database down" } });

    await expect(onboardingService.getQuiz()).rejects.toMatchObject({
      status: 500,
      message: "Database down",
    });
  });
});

describe("onboardingService.scoreQuiz", () => {
  it("posts the answers and returns the learning style", async () => {
    mockedPost.mockResolvedValue({ data: scoreResponse });
    const answers = [{ questionId: "flat-pack-desk", optionId: "a" }];

    await expect(onboardingService.scoreQuiz(answers)).resolves.toEqual(scoreResponse);
    expect(mockedPost).toHaveBeenCalledWith("/api/onboarding/quiz", { answers });
  });

  it("turns a failed request into a service error", async () => {
    mockedPost.mockRejectedValue({ statusCode: 400, serverError: { message: "Bad answers" } });

    await expect(onboardingService.scoreQuiz([])).rejects.toMatchObject({
      status: 400,
      message: "Bad answers",
    });
  });

  it("rejects when the response has the wrong shape", async () => {
    mockedPost.mockResolvedValue({ data: { data: { learningStyle: {} } } });

    await expect(onboardingService.scoreQuiz([])).rejects.toMatchObject({
      message: "Incorrect data format",
    });
  });
});

describe("onboardingService.completeOnboarding", () => {
  const answers = {
    learningStyleId: "1b2c3d4e-5f60-4718-9a2b-3c4d5e6f7a80",
    codeLanguageId: "8d3c1f9e-4b1a-4c55-9d0e-2f6a7b8c9d01",
    showOnLeaderboard: false,
    textToSpeech: true,
  };
  const meResponse = {
    data: {
      user: { email: "ada@example.com", emailVerified: false, displayName: "Ada" },
      profile: { ...answers, colourTheme: "default", onboardingComplete: true },
    },
  };

  it("posts the four answers and returns the me body", async () => {
    mockedPost.mockResolvedValue({ data: meResponse });

    await expect(onboardingService.completeOnboarding(answers)).resolves.toEqual(meResponse);
    expect(mockedPost).toHaveBeenCalledWith("/api/onboarding", answers);
  });

  it("turns a 400 into a service error", async () => {
    mockedPost.mockRejectedValue({ statusCode: 400, serverError: { message: "Unknown id" } });

    await expect(onboardingService.completeOnboarding(answers)).rejects.toMatchObject({
      status: 400,
      message: "Unknown id",
    });
  });

  it("rejects when the response has the wrong shape", async () => {
    mockedPost.mockResolvedValue({ data: { data: { profile: {} } } });

    await expect(onboardingService.completeOnboarding(answers)).rejects.toMatchObject({
      message: "Incorrect data format",
    });
  });
});
