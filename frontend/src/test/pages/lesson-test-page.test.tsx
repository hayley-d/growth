import { beforeEach, expect, it, vi } from "vitest";
import { page } from "vitest/browser";

import { networkService } from "@/services/network.service";
import { lessonIdAt } from "@/test/learning-path-fixture";
import { renderApp } from "@/test/render-app";

vi.mock("@/services/network.service", () => ({
  networkService: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

const mockedGet = vi.mocked(networkService.get);
const mockedPost = vi.mocked(networkService.post);

const lessonId = lessonIdAt(0);
const attemptId = "20000000-0000-4000-8000-000000000001";
const firstQuestionId = "30000000-0000-4000-8000-000000000001";
const secondQuestionId = "30000000-0000-4000-8000-000000000002";
const correctOptionId = "40000000-0000-4000-8000-000000000001";
const wrongOptionId = "40000000-0000-4000-8000-000000000002";
const testPath = `/lessons/${lessonId}/test`;

const attempt = (answeredCount: number, finished = false) => ({
  id: attemptId,
  lessonId,
  kind: "lesson_test",
  topic: null,
  status: finished ? "finished" : "in_progress",
  total: 2,
  answeredCount,
  startedAt: "2026-11-11T10:00:00.000Z",
  finishedAt: finished ? "2026-11-11T10:05:00.000Z" : null,
});

const question = (id: string, position: number, hints: string[] = []) => ({
  id,
  position,
  type: "multiple_choice",
  prompt: `Question ${position} prompt`,
  tree: null,
  options: [
    { id: correctOptionId, text: "Root first" },
    { id: wrongOptionId, text: "Root last" },
  ],
  difficulty: 1,
  hints,
  hintsTotal: 2,
  hintsRemaining: 2 - hints.length,
});

const result = {
  score: 50,
  passed: false,
  points: 70,
  ratingChange: 12,
  masteryBefore: 20,
  masteryAfter: 45,
  reviewLessons: [{ id: lessonIdAt(1), title: "Pre-order" }],
  answers: [],
};

const answerResponse = (isCorrect: boolean, finished: boolean) => ({
  data: {
    isCorrect,
    correctAnswer: { type: "multiple_choice", optionId: correctOptionId },
    explanation: "Pre-order visits the root first.",
    replay: { kind: "operation", operation: "insert", key: 10 },
    hintsUsed: 0,
    points: 70,
    rating: { before: 1000, after: 1012 },
    attempt: attempt(finished ? 2 : 1, finished),
    question: finished ? null : question(secondQuestionId, 2),
    result: finished ? result : null,
  },
});

const serve = () => {
  mockedGet.mockResolvedValue({
    data: { data: { units: [], progress: 0, currentLessonId: null } },
  });
  mockedPost.mockImplementation(async (url: string) => {
    if (url.endsWith(`/lessons/${lessonId}/attempts`)) {
      return {
        data: {
          data: { attempt: attempt(0), question: question(firstQuestionId, 1), result: null },
        },
      };
    }
    if (url.endsWith("/hints")) {
      return {
        data: {
          data: {
            questionId: firstQuestionId,
            hint: "Think root.",
            hintNumber: 1,
            hintsRemaining: 1,
          },
        },
      };
    }
    return { data: answerResponse(false, false) };
  });
};

beforeEach(async () => {
  await page.viewport(1280, 900);
  mockedGet.mockReset();
  mockedPost.mockReset();
});

it("shows the question with its progress and an unlocked hint", async () => {
  serve();
  const screen = await renderApp(testPath);

  await expect.element(screen.getByRole("heading", { name: "Test", level: 1 })).toBeVisible();
  await expect.element(screen.getByText("Question 1 of 2")).toBeVisible();
  await expect.element(screen.getByRole("heading", { name: "Question 1 prompt" })).toBeVisible();
  await expect.element(screen.getByText("Using hints lowers your score.")).toBeVisible();

  await screen.getByRole("button", { name: "Hint (2 left)" }).click();

  await expect.element(screen.getByText("Think root.")).toBeVisible();
  await expect.element(screen.getByRole("button", { name: "Hint (1 left)" })).toBeVisible();
});

it("gives feedback with words, an explanation and a replay, then the next question", async () => {
  serve();
  const screen = await renderApp(testPath);

  await screen.getByRole("radio", { name: "Root last" }).click();
  await screen.getByRole("button", { name: "Submit" }).click();

  await expect.element(screen.getByRole("heading", { name: "Not quite" })).toBeVisible();
  await expect.element(screen.getByText("Pre-order visits the root first.")).toBeVisible();
  await expect
    .element(screen.getByRole("group", { name: "Replay of the correct answer" }))
    .toBeVisible();

  await screen.getByRole("button", { name: "Next" }).click();

  await expect.element(screen.getByText("Question 2 of 2")).toBeVisible();
});

it("shows the results after the last answer and lets the learner retake", async () => {
  serve();
  mockedPost.mockImplementation(async (url: string) => {
    if (url.endsWith("/answers")) return { data: answerResponse(true, true) };
    return {
      data: {
        data: { attempt: attempt(1), question: question(secondQuestionId, 2), result: null },
      },
    };
  });
  const screen = await renderApp(testPath);

  await screen.getByRole("radio", { name: "Root first" }).click();
  await screen.getByRole("button", { name: "Submit" }).click();
  await expect.element(screen.getByRole("heading", { name: "Correct" })).toBeVisible();
  await screen.getByRole("button", { name: "See results" }).click();

  await expect.element(screen.getByRole("heading", { name: "Not passed" })).toBeVisible();
  await expect.element(screen.getByText("50%")).toBeVisible();
  await expect.element(screen.getByText("70")).toBeVisible();
  await expect.element(screen.getByText("20%")).toBeVisible();
  await expect.element(screen.getByText("45%")).toBeVisible();
  await expect.element(screen.getByText("Getting there")).toBeVisible();
  await expect.element(screen.getByRole("link", { name: "Review Pre-order" })).toBeVisible();
  await expect.element(screen.getByRole("link", { name: "Back to Learn" })).toBeVisible();
  await expect.element(screen.getByRole("button", { name: "Retake" })).toBeVisible();
});

it("asks before leaving mid-test and lets the learner stay", async () => {
  serve();
  const screen = await renderApp(testPath);
  await expect.element(screen.getByText("Question 1 of 2")).toBeVisible();

  await screen.getByRole("link", { name: "Leave the test" }).click();

  await expect.element(screen.getByRole("alertdialog", { name: "Leave this test?" })).toBeVisible();
  await screen.getByRole("button", { name: "Stay" }).click();
  await expect.element(screen.getByText("Question 1 of 2")).toBeVisible();

  await screen.getByRole("link", { name: "Leave the test" }).click();
  await screen.getByRole("button", { name: "Leave test" }).click();
  await expect.element(screen.getByRole("heading", { name: "Learn", level: 1 })).toBeVisible();
});

it("shows an error with a retry when the test cannot start", async () => {
  mockedGet.mockResolvedValue({
    data: { data: { units: [], progress: 0, currentLessonId: null } },
  });
  mockedPost.mockRejectedValue({
    statusCode: 404,
    message: "Lesson not found",
    serverError: { message: "Lesson not found" },
  });
  const screen = await renderApp(testPath);

  await expect.element(screen.getByRole("alert")).toHaveTextContent("Lesson not found");
  await expect.element(screen.getByRole("button", { name: "Try again" })).toBeVisible();
});

const serveFinishingAnswer = () => {
  serve();
  mockedPost.mockImplementation(async (url: string) => {
    if (url.endsWith("/answers")) return { data: answerResponse(true, true) };
    return {
      data: {
        data: { attempt: attempt(1), question: question(secondQuestionId, 2), result: null },
      },
    };
  });
};

it("shows an error when a retake cannot start and keeps the results", async () => {
  serveFinishingAnswer();
  const screen = await renderApp(testPath);
  await screen.getByRole("radio", { name: "Root first" }).click();
  await screen.getByRole("button", { name: "Submit" }).click();
  await screen.getByRole("button", { name: "See results" }).click();
  await expect.element(screen.getByRole("heading", { name: "Not passed" })).toBeVisible();

  mockedPost.mockRejectedValue({
    statusCode: 500,
    message: "Server error",
    serverError: { message: "Could not start" },
  });
  await screen.getByRole("button", { name: "Retake" }).click();

  await expect.element(screen.getByRole("alert")).toHaveTextContent("Could not start");
  await expect.element(screen.getByRole("heading", { name: "Not passed" })).toBeVisible();
  await expect.element(screen.getByRole("button", { name: "Retake" })).toBeEnabled();
});

it("does not carry a failed hint over to the next question", async () => {
  serve();
  mockedPost.mockImplementation(async (url: string) => {
    if (url.endsWith("/hints")) {
      throw {
        statusCode: 409,
        message: "Conflict",
        serverError: { message: "No more hints" },
      };
    }
    if (url.endsWith("/answers")) return { data: answerResponse(false, false) };
    return {
      data: { data: { attempt: attempt(0), question: question(firstQuestionId, 1), result: null } },
    };
  });
  const screen = await renderApp(testPath);

  await screen.getByRole("button", { name: "Hint (2 left)" }).click();
  await expect.element(screen.getByRole("alert")).toHaveTextContent("No more hints");
  await screen.getByRole("radio", { name: "Root last" }).click();
  await screen.getByRole("button", { name: "Submit" }).click();
  await screen.getByRole("button", { name: "Next" }).click();

  await expect.element(screen.getByText("Question 2 of 2")).toBeVisible();
  expect(screen.getByRole("alert").elements()).toHaveLength(0);
});

it("does not ask to confirm leaving once the last answer is in", async () => {
  serveFinishingAnswer();
  const screen = await renderApp(testPath);
  await screen.getByRole("radio", { name: "Root first" }).click();
  await screen.getByRole("button", { name: "Submit" }).click();
  await expect.element(screen.getByRole("button", { name: "See results" })).toBeVisible();

  await screen.getByRole("link", { name: "Leave the test" }).click();

  await expect.element(screen.getByRole("heading", { name: "Learn", level: 1 })).toBeVisible();
  expect(screen.getByRole("alertdialog").elements()).toHaveLength(0);
});
