import { beforeEach, expect, it, vi } from "vitest";
import { page } from "vitest/browser";

import { networkService } from "@/services/network.service";
import { buildLearningPath } from "@/test/learning-path-fixture";
import { renderApp } from "@/test/render-app";

vi.mock("@/services/network.service", () => ({
  networkService: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

const mockedGet = vi.mocked(networkService.get);
const mockedPost = vi.mocked(networkService.post);

beforeEach(async () => {
  await page.viewport(1280, 800);
  mockedGet.mockReset();
  mockedPost.mockReset();
});

it("shows the current lesson in a continue card", async () => {
  mockedGet.mockResolvedValue({ data: buildLearningPath(2) });
  const screen = await renderApp("/");

  await expect.element(screen.getByRole("heading", { name: "Dashboard", level: 1 })).toBeVisible();
  await expect.element(screen.getByRole("heading", { name: "In-order" })).toBeVisible();
  await expect.element(screen.getByRole("button", { name: "Continue: In-order" })).toBeVisible();
});

it("says start when no lesson is completed yet", async () => {
  mockedGet.mockResolvedValue({ data: buildLearningPath(0) });
  const screen = await renderApp("/");

  await expect
    .element(screen.getByRole("heading", { name: "Start learning", level: 2 }))
    .toBeVisible();
  await expect
    .element(screen.getByRole("button", { name: "Start: What is a binary tree" }))
    .toBeVisible();
});

it("shows the overall and unit progress as bars and numbers", async () => {
  mockedGet.mockResolvedValue({ data: buildLearningPath(2) });
  const screen = await renderApp("/");

  await expect
    .element(screen.getByRole("progressbar", { name: "Overall progress" }))
    .toHaveAttribute("aria-valuenow", "17");
  await expect.element(screen.getByText("17%")).toBeVisible();
  await expect
    .element(screen.getByRole("progressbar", { name: "Binary trees and traversals progress" }))
    .toHaveAttribute("aria-valuenow", "33");
  await expect.element(screen.getByText("33%")).toBeVisible();
  await expect
    .element(screen.getByRole("progressbar", { name: "AVL trees progress" }))
    .toHaveAttribute("aria-valuenow", "0");
});

it("starts the lesson from the continue card", async () => {
  mockedGet.mockResolvedValue({ data: buildLearningPath(2) });
  mockedPost.mockResolvedValue({ data: {} });
  const screen = await renderApp("/");

  await screen.getByRole("button", { name: "Continue: In-order" }).click();

  expect(mockedPost).toHaveBeenCalled();
});

it("shows the finished state when all 12 lessons are done", async () => {
  mockedGet.mockResolvedValue({ data: buildLearningPath(12) });
  const screen = await renderApp("/");

  await expect
    .element(screen.getByRole("heading", { name: "You've finished the course" }))
    .toBeVisible();
  await expect
    .element(screen.getByRole("progressbar", { name: "Overall progress" }))
    .toHaveAttribute("aria-valuenow", "100");
  await expect.element(screen.getByRole("button", { name: /^Continue:/ })).not.toBeInTheDocument();
});

it("shows an error and lets the learner try again", async () => {
  let learningPathCalls = 0;
  mockedGet.mockImplementation(async (url: string) => {
    if (url.endsWith("/daily-challenge")) throw { statusCode: 500, message: "Server error" };
    learningPathCalls += 1;
    if (learningPathCalls === 1) {
      throw {
        statusCode: 401,
        message: "Request failed",
        serverError: { message: "Unable to load your learning path" },
      };
    }
    return { data: buildLearningPath(2) };
  });
  const screen = await renderApp("/");

  await expect
    .element(screen.getByRole("alert"))
    .toHaveTextContent("Unable to load your learning path");
  await screen.getByRole("button", { name: "Try again" }).click();

  await expect.element(screen.getByRole("button", { name: "Continue: In-order" })).toBeVisible();
});

it("shows a loading state first", async () => {
  mockedGet.mockReturnValue(new Promise(() => undefined));
  const screen = await renderApp("/");

  await expect.element(screen.getByText("Loading...")).toBeVisible();
});

it("lists mastery for each lesson that is not locked", async () => {
  mockedGet.mockResolvedValue({ data: buildLearningPath(2, { 0: 90, 1: 45 }) });
  const screen = await renderApp("/");

  await expect
    .element(screen.getByRole("heading", { name: "Your mastery", level: 2 }))
    .toBeVisible();
  await expect.element(screen.getByText(/Strong/)).toBeVisible();
  await expect.element(screen.getByText(/Getting there/)).toBeVisible();
  await expect.element(screen.getByText(/Just started/)).toBeVisible();
  expect(screen.getByRole("progressbar", { name: "Mastery" }).elements()).toHaveLength(3);
});

const dailyBase = {
  date: "2026-11-14",
  nextChallengeAt: new Date(Date.now() + 3_600_000).toISOString(),
  startedAt: null,
  finishedAt: null,
  question: null,
  result: null,
};

const serveWithDaily = (daily: object) =>
  mockedGet.mockImplementation(async (url: string) =>
    url.endsWith("/daily-challenge") ? { data: { data: daily } } : { data: buildLearningPath(2) },
  );

it("links to today's challenge when the learner hasn't done it", async () => {
  serveWithDaily({ ...dailyBase, status: "not_started" });
  const screen = await renderApp("/");

  await expect
    .element(screen.getByRole("heading", { name: "Daily challenge", level: 2 }))
    .toBeVisible();
  await expect
    .element(screen.getByRole("link", { name: "Take today's challenge" }))
    .toHaveAttribute("href", "/daily");
});

it("sends the learner back to a challenge they've started", async () => {
  serveWithDaily({
    ...dailyBase,
    status: "in_progress",
    startedAt: new Date(Date.now() - 30_000).toISOString(),
  });
  const screen = await renderApp("/");

  await expect
    .element(screen.getByRole("link", { name: "Finish today's challenge" }))
    .toBeVisible();
  await expect.element(screen.getByText("Time so far")).toBeVisible();
});

const finishedDaily = {
  ...dailyBase,
  status: "finished",
  startedAt: "2026-11-14T06:00:00.000Z",
  finishedAt: "2026-11-14T06:01:05.000Z",
  result: {
    prompt: "Is this tree a valid AVL tree?",
    tree: null,
    response: { type: "text", text: "3" },
    isCorrect: true,
    correctAnswer: { type: "text", text: "3" },
    explanation: "A leaf has height 1.",
    replay: null,
    points: 30,
    timeTakenSeconds: 65,
  },
};

const serveWithDailyAndLeaderboard = (daily: object, leaderboard: object) =>
  mockedGet.mockImplementation(async (url: string) => {
    if (url.endsWith("/daily-challenge")) return { data: { data: daily } };
    if (url.endsWith("/leaderboard")) return { data: { data: leaderboard } };
    return { data: buildLearningPath(2) };
  });

it("hides the daily challenge once today's challenge is done", async () => {
  serveWithDailyAndLeaderboard(finishedDaily, { top: [], me: null });
  const screen = await renderApp("/");

  await expect
    .element(screen.getByRole("heading", { name: "Leaderboard", level: 2 }))
    .toBeVisible();
  await expect
    .element(screen.getByRole("heading", { name: "Daily challenge", level: 2 }))
    .not.toBeInTheDocument();
});

it("shows the board with the learner's row, time and points", async () => {
  serveWithDailyAndLeaderboard(finishedDaily, {
    top: [
      { rank: 1, displayName: "Ada", timeSeconds: 40, points: 30, isMe: false },
      { rank: 2, displayName: "Bea", timeSeconds: 65, points: 30, isMe: true },
    ],
    me: {
      displayName: "Bea",
      rank: 2,
      timeSeconds: 65,
      points: 30,
      passed: true,
      hidden: false,
    },
  });
  const screen = await renderApp("/");

  const leaderboard = screen.getByRole("region", { name: "Leaderboard" });
  await expect.element(leaderboard.getByText("Ada")).toBeVisible();
  await expect.element(leaderboard.getByText("You", { exact: true })).toBeVisible();
  await expect.element(leaderboard.getByText("1 minute 5 seconds")).toBeInTheDocument();
  await expect.element(leaderboard.getByRole("link")).not.toBeInTheDocument();
});

it("shows the board before the learner has done today's challenge", async () => {
  serveWithDailyAndLeaderboard(
    { ...dailyBase, status: "not_started" },
    { top: [{ rank: 1, displayName: "Ada", timeSeconds: 40, points: 30, isMe: false }], me: null },
  );
  const screen = await renderApp("/");

  const leaderboard = screen.getByRole("region", { name: "Leaderboard" });
  await expect.element(leaderboard.getByText("Ada")).toBeVisible();
  await expect
    .element(screen.getByRole("heading", { name: "Daily challenge", level: 2 }))
    .toBeVisible();
});

it("tells a learner who did not pass to come back tomorrow", async () => {
  serveWithDailyAndLeaderboard(finishedDaily, {
    top: [],
    me: {
      displayName: "Bea",
      rank: null,
      timeSeconds: 65,
      points: 0,
      passed: false,
      hidden: false,
    },
  });
  const screen = await renderApp("/");

  await expect
    .element(screen.getByText("You didn't pass today's challenge. Come back tomorrow."))
    .toBeVisible();
});

it("still offers the daily challenge page when the card can't load", async () => {
  mockedGet.mockImplementation(async (url: string) => {
    if (url.endsWith("/daily-challenge")) throw { statusCode: 500, message: "Server error" };
    return { data: buildLearningPath(2) };
  });
  const screen = await renderApp("/");

  await expect
    .element(screen.getByRole("link", { name: "Open the daily challenge" }))
    .toHaveAttribute("href", "/daily");
  await expect.element(screen.getByRole("alert")).not.toBeInTheDocument();
});

it("keeps mastery right under progress when the leaderboard is long", async () => {
  await page.viewport(1440, 900);
  serveWithDailyAndLeaderboard(finishedDaily, {
    top: Array.from({ length: 10 }, (_, index) => ({
      rank: index + 1,
      displayName: `Learner ${index + 1}`,
      timeSeconds: 40 + index,
      points: 30,
      isMe: false,
    })),
    me: {
      displayName: "Bea",
      rank: 40,
      timeSeconds: 300,
      points: 30,
      passed: true,
      hidden: false,
    },
  });
  const screen = await renderApp("/");

  const leaderboard = screen.getByRole("region", { name: "Leaderboard" });
  await expect.element(leaderboard.getByText("Learner 1", { exact: true })).toBeVisible();
  const progress = screen.getByRole("region", { name: "Your progress" }).element();
  const mastery = screen.getByRole("region", { name: "Your mastery" }).element();
  const progressBox = progress.getBoundingClientRect();
  const masteryBox = mastery.getBoundingClientRect();
  const leaderboardBox = leaderboard.element().getBoundingClientRect();

  expect(masteryBox.top - progressBox.bottom).toBeLessThanOrEqual(16);
  expect(leaderboardBox.left).toBeGreaterThanOrEqual(progressBox.right);
  expect(leaderboardBox.top).toBe(progressBox.top);
});
