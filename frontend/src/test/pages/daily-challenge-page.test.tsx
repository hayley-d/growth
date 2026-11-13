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

const questionId = "30000000-0000-4000-8000-000000000001";
const yesOptionId = "40000000-0000-4000-8000-000000000001";
const noOptionId = "40000000-0000-4000-8000-000000000002";

const base = {
  date: "2026-11-14",
  nextChallengeAt: "2026-11-14T22:00:00.000Z",
  startedAt: null,
  finishedAt: null,
  question: null,
  result: null,
};

const notStarted = { ...base, status: "not_started" };

const inProgress = {
  ...base,
  status: "in_progress",
  startedAt: new Date(Date.now() - 65_000).toISOString(),
  question: {
    id: questionId,
    position: 1,
    type: "multiple_choice",
    prompt: "Is this tree a valid AVL tree?",
    tree: null,
    options: [
      { id: yesOptionId, text: "Yes" },
      { id: noOptionId, text: "No" },
    ],
    difficulty: 2,
    hints: [],
    hintsTotal: 0,
    hintsRemaining: 0,
  },
};

const finished = {
  ...base,
  status: "finished",
  nextChallengeAt: new Date(Date.now() + 3_600_000).toISOString(),
  startedAt: "2026-11-14T06:00:00.000Z",
  finishedAt: "2026-11-14T06:01:05.000Z",
  result: {
    prompt: "Is this tree a valid AVL tree?",
    tree: null,
    response: { type: "multiple_choice", optionId: noOptionId },
    isCorrect: false,
    correctAnswer: { type: "multiple_choice", optionId: yesOptionId },
    explanation: "Every node's balance factor is -1, 0 or 1.",
    replay: null,
    points: 0,
    timeTakenSeconds: 65,
  },
};

const serve = (state: object) => {
  mockedGet.mockImplementation(async (url: string) =>
    url.endsWith("/daily-challenge")
      ? { data: { data: state } }
      : { data: { data: { units: [], progress: 0, currentLessonId: null } } },
  );
  mockedPost.mockImplementation(async (url: string) => {
    if (url.endsWith("/daily-challenge/start")) return { data: { data: inProgress } };
    return { data: { data: finished } };
  });
};

beforeEach(async () => {
  await page.viewport(1280, 900);
  mockedGet.mockReset();
  mockedPost.mockReset();
});

it("explains the rules and waits for Start before showing the question", async () => {
  serve(notStarted);
  const screen = await renderApp("/daily");

  await expect
    .element(screen.getByRole("heading", { name: "Daily challenge", level: 1 }))
    .toBeVisible();
  await expect.element(screen.getByText("Saturday 14 November")).toBeVisible();
  await expect.element(screen.getByText(/one go, with no hints/)).toBeVisible();
  await expect
    .element(screen.getByRole("heading", { name: "Is this tree a valid AVL tree?" }))
    .not.toBeInTheDocument();
  expect(mockedPost).not.toHaveBeenCalled();
});

it("starts the clock, takes one answer with no hints and shows the summary", async () => {
  serve(notStarted);
  const screen = await renderApp("/daily");

  await screen.getByRole("button", { name: "Start" }).click();

  await expect
    .element(screen.getByRole("heading", { name: "Is this tree a valid AVL tree?" }))
    .toBeVisible();
  await expect.element(screen.getByText("Difficulty 2 of 5")).toBeInTheDocument();
  await expect.element(screen.getByText(/^1 minute/)).toBeInTheDocument();
  await expect.element(screen.getByRole("button", { name: /Hint/ })).not.toBeInTheDocument();

  await screen.getByRole("radio", { name: "No" }).click();
  await screen.getByRole("button", { name: "Submit" }).click();

  expect(mockedPost).toHaveBeenCalledWith(expect.stringMatching(/\/daily-challenge\/answers$/), {
    questionId,
    answer: { type: "multiple_choice", optionId: noOptionId },
  });
  await expect.element(screen.getByRole("heading", { name: "Not quite" })).toBeVisible();
  await expect
    .element(screen.getByText("Every node's balance factor is -1, 0 or 1."))
    .toBeVisible();
  await expect.element(screen.getByText("1 minute 5 seconds")).toBeInTheDocument();
  await expect.element(screen.getByRole("heading", { name: "Next challenge" })).toBeVisible();
  await expect.element(screen.getByRole("button", { name: "Next" })).not.toBeInTheDocument();
});

it("goes straight back to the question after a reload mid-challenge", async () => {
  serve(inProgress);
  const screen = await renderApp("/daily");

  await expect
    .element(screen.getByRole("heading", { name: "Is this tree a valid AVL tree?" }))
    .toBeVisible();
  await expect.element(screen.getByRole("button", { name: "Start" })).not.toBeInTheDocument();
});

it("shows the summary and a countdown when today's challenge is done", async () => {
  serve(finished);
  const screen = await renderApp("/daily");

  await expect.element(screen.getByRole("heading", { name: "Not quite" })).toBeVisible();
  await expect.element(screen.getByText(/^(59 minutes|1 hour)/)).toBeInTheDocument();
});

it("shows the server message when the challenge can't start", async () => {
  serve(notStarted);
  mockedPost.mockRejectedValue({
    statusCode: 409,
    message: "Conflict",
    serverError: { message: "No daily challenge questions yet" },
  });
  const screen = await renderApp("/daily");

  await screen.getByRole("button", { name: "Start" }).click();

  await expect
    .element(screen.getByRole("alert"))
    .toHaveTextContent("No daily challenge questions yet");
});

it("moves to the next day's challenge once midnight passes", async () => {
  serve(notStarted);
  const yesterday = { ...finished, nextChallengeAt: new Date(Date.now() + 500).toISOString() };
  let dailyCalls = 0;
  mockedGet.mockImplementation(async (url: string) => {
    if (!url.endsWith("/daily-challenge")) {
      return { data: { data: { units: [], progress: 0, currentLessonId: null } } };
    }
    dailyCalls += 1;
    return { data: { data: dailyCalls === 1 ? yesterday : notStarted } };
  });
  const screen = await renderApp("/daily");

  await expect.element(screen.getByRole("heading", { name: "Not quite" })).toBeVisible();
  await expect.element(screen.getByRole("button", { name: "Start" })).toBeVisible();
  await expect.element(screen.getByRole("heading", { name: "Not quite" })).not.toBeInTheDocument();
  expect(dailyCalls).toBe(2);
});
