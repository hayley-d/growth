import { beforeEach, expect, it, vi } from "vitest";
import { page } from "vitest/browser";

import { networkService } from "@/services/network.service";
import { renderApp } from "@/test/render-app";

vi.mock("@/services/network.service", () => ({
  networkService: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

const mockedGet = vi.mocked(networkService.get);
const mockedPost = vi.mocked(networkService.post);

const lessonId = "10000000-0000-4000-8000-000000000001";
const attemptId = "20000000-0000-4000-8000-000000000001";
const firstQuestionId = "30000000-0000-4000-8000-000000000001";
const secondQuestionId = "30000000-0000-4000-8000-000000000002";
const correctOptionId = "40000000-0000-4000-8000-000000000001";
const wrongOptionId = "40000000-0000-4000-8000-000000000002";

const attempt = (answeredCount: number, finished = false) => ({
  id: attemptId,
  lessonId: null,
  kind: "practice",
  topic: "traversals",
  status: finished ? "finished" : "in_progress",
  total: answeredCount + 1,
  answeredCount,
  startedAt: "2026-11-12T10:00:00.000Z",
  finishedAt: null,
});

const question = (id: string, position: number) => ({
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
  hints: [],
  hintsTotal: 2,
  hintsRemaining: 2,
});

const summary = {
  answered: 1,
  correct: 0,
  ratingChange: -8,
  lessons: [
    {
      lessonId,
      title: "Pre-order",
      ratingBefore: 1000,
      ratingAfter: 992,
    },
  ],
};

const serve = () => {
  mockedGet.mockImplementation(async (url: string) => {
    if (url.endsWith("/practice/topics")) {
      return {
        data: {
          data: [
            { topic: "traversals", available: true },
            { topic: "insertion", available: false },
            { topic: "mixed", available: true },
          ],
        },
      };
    }
    return { data: { data: { units: [], progress: 0, currentLessonId: null } } };
  });
  mockedPost.mockImplementation(async (url: string) => {
    if (url.endsWith("/practice/attempts")) {
      return {
        data: {
          data: { attempt: attempt(0), question: question(firstQuestionId, 1), result: null },
        },
      };
    }
    if (url.endsWith("/answers")) {
      return {
        data: {
          data: {
            isCorrect: false,
            correctAnswer: { type: "multiple_choice", optionId: correctOptionId },
            explanation: "Pre-order visits the root first.",
            replay: null,
            hintsUsed: 0,
            points: 0,
            rating: { before: 1000, after: 992 },
            attempt: attempt(1),
            question: null,
            result: null,
          },
        },
      };
    }
    if (url.endsWith("/questions")) {
      return {
        data: {
          data: { attempt: attempt(1), question: question(secondQuestionId, 2), result: null },
        },
      };
    }
    return { data: { data: summary } };
  });
};

beforeEach(async () => {
  await page.viewport(1280, 900);
  mockedGet.mockReset();
  mockedPost.mockReset();
});

it("lists the topics and disables the ones without questions", async () => {
  serve();
  const screen = await renderApp("/practice");

  await expect.element(screen.getByRole("heading", { name: "Practice", level: 1 })).toBeVisible();
  await expect.element(screen.getByRole("button", { name: /Traversals/ })).toBeEnabled();
  await expect.element(screen.getByRole("button", { name: /Insertion/ })).toBeDisabled();
  await expect.element(screen.getByText("Unlock a lesson on this first.")).toBeVisible();
  await expect.element(screen.getByText(/Practice has no stakes/)).toBeVisible();
});

it("serves a question, gives feedback and then the next question", async () => {
  serve();
  const screen = await renderApp("/practice");

  await screen.getByRole("button", { name: /Traversals/ }).click();
  await expect.element(screen.getByRole("heading", { name: "Question 1 prompt" })).toBeVisible();

  await expect.element(screen.getByText("Difficulty 1 of 5")).toBeInTheDocument();
  await expect
    .element(screen.getByRole("img", { name: "Your session tree: 0 of 0 right" }))
    .toBeVisible();
  await expect.element(screen.getByText(/Each one only softens/)).toBeVisible();

  await screen.getByRole("radio", { name: "Root last" }).click();
  await screen.getByRole("button", { name: "Submit" }).click();
  await expect.element(screen.getByRole("heading", { name: "Not quite" })).toBeVisible();
  await expect
    .element(screen.getByRole("img", { name: "Your session tree: 0 of 1 right" }))
    .toBeVisible();

  await screen.getByRole("button", { name: "Next question" }).click();
  await expect.element(screen.getByRole("heading", { name: "Question 2 prompt" })).toBeVisible();
});

it("shows the grown tree and mastery shifts when the learner stops", async () => {
  serve();
  const screen = await renderApp("/practice");

  await screen.getByRole("button", { name: /Traversals/ }).click();
  await screen.getByRole("radio", { name: "Root last" }).click();
  await screen.getByRole("button", { name: "Submit" }).click();
  await expect.element(screen.getByRole("heading", { name: "Not quite" })).toBeVisible();
  await screen.getByRole("button", { name: "Stop practising" }).click();

  await expect
    .element(screen.getByRole("heading", { name: "You grew a 1-node tree", level: 1 }))
    .toBeVisible();
  await expect.element(screen.getByText(/0 of 1 right/)).toBeVisible();
  await expect.element(screen.getByText(/doesn't change your mastery/)).toBeVisible();
  // Ratings show as mastery: 1000 is 36%, 992 is 35%.
  await expect
    .element(screen.getByRole("progressbar", { name: "Pre-order mastery" }))
    .toHaveAttribute("aria-valuetext", "36% to 35%");
  await expect.element(screen.getByRole("link", { name: "Pre-order" })).toBeVisible();

  await screen.getByRole("button", { name: "Practice again" }).click();
  await expect.element(screen.getByRole("button", { name: /Mixed/ })).toBeVisible();
});

it("says so when the learner stops before answering", async () => {
  serve();
  const screen = await renderApp("/practice");
  mockedPost.mockImplementation(async (url: string) =>
    url.endsWith("/finish")
      ? { data: { data: { answered: 0, correct: 0, ratingChange: 0, lessons: [] } } }
      : {
          data: {
            data: { attempt: attempt(0), question: question(firstQuestionId, 1), result: null },
          },
        },
  );

  await screen.getByRole("button", { name: /Traversals/ }).click();
  await screen.getByRole("button", { name: "Stop practising" }).click();

  await expect.element(screen.getByRole("heading", { name: "No tree this time" })).toBeVisible();
});

it("shows the server message when a topic cannot start", async () => {
  serve();
  mockedPost.mockRejectedValue({
    statusCode: 409,
    message: "Conflict",
    serverError: { message: "No questions for this topic yet" },
  });
  const screen = await renderApp("/practice");

  await screen.getByRole("button", { name: /Mixed/ }).click();

  await expect
    .element(screen.getByRole("alert"))
    .toHaveTextContent("No questions for this topic yet");
});
