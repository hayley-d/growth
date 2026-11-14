import { beforeEach, expect, it, vi } from "vitest";
import { page } from "vitest/browser";

import { networkService } from "@/services/network.service";
import { buildLearningPath, lessonIdAt } from "@/test/learning-path-fixture";
import { buildLesson } from "@/test/lesson-fixture";
import { renderApp } from "@/test/render-app";

vi.mock("@/services/network.service", () => ({
  networkService: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

const mockedGet = vi.mocked(networkService.get);
const mockedPost = vi.mocked(networkService.post);

const serveMapAndLessons = (completedCount: number) => {
  mockedGet.mockImplementation(async (url: string) => {
    const lessonId = /^\/api\/lessons\/([^/]+)$/.exec(url)?.[1];
    if (lessonId) return { data: buildLesson({ id: lessonId }) };
    return { data: buildLearningPath(completedCount) };
  });
};

beforeEach(async () => {
  await page.viewport(1280, 800);
  mockedGet.mockReset();
  mockedPost.mockReset();
});

it("shows the heading, a bar for each unit and the map", async () => {
  mockedGet.mockResolvedValue({ data: buildLearningPath(2) });
  const screen = await renderApp("/learn");

  await expect.element(screen.getByRole("heading", { name: "Learn", level: 1 })).toBeVisible();
  await expect
    .element(screen.getByRole("progressbar", { name: "Binary trees and traversals progress" }))
    .toHaveAttribute("aria-valuenow", "33");
  await expect
    .element(screen.getByRole("progressbar", { name: "AVL trees progress" }))
    .toHaveAttribute("aria-valuenow", "0");
  await expect.element(screen.getByRole("button", { name: "In-order, up next" })).toBeVisible();
});

it("shows a loading state first", async () => {
  mockedGet.mockReturnValue(new Promise(() => undefined));
  const screen = await renderApp("/learn");

  await expect.element(screen.getByText("Loading...")).toBeVisible();
});

it("shows the error and lets the learner try again", async () => {
  mockedGet.mockRejectedValueOnce({
    statusCode: 401,
    message: "Request failed",
    serverError: { message: "Unable to load your learning path" },
  });
  mockedGet.mockResolvedValue({ data: buildLearningPath(2) });
  const screen = await renderApp("/learn");

  await expect
    .element(screen.getByRole("alert"))
    .toHaveTextContent("Unable to load your learning path");
  await screen.getByRole("button", { name: "Try again" }).click();

  await expect.element(screen.getByRole("button", { name: "In-order, up next" })).toBeVisible();
});

it("says so when every lesson is done", async () => {
  mockedGet.mockResolvedValue({ data: buildLearningPath(12) });
  const screen = await renderApp("/learn");

  await expect
    .element(screen.getByText("You've finished every lesson. Tap any node to review it."))
    .toBeVisible();
});

it("starts the lesson and goes to the lesson page", async () => {
  serveMapAndLessons(2);
  mockedPost.mockResolvedValue({ data: "" });
  const screen = await renderApp("/learn");

  await screen.getByRole("button", { name: "In-order, up next" }).click();
  await page.getByRole("button", { name: "Start lesson" }).click();

  await expect.element(screen.getByRole("progressbar", { name: "Lesson progress" })).toBeVisible();
  expect(mockedPost).toHaveBeenCalledWith(
    "/api/lessons/00000000-0000-4000-8000-000000000003/start",
  );
});

it("stays on the map and shows the error when the start fails", async () => {
  mockedGet.mockResolvedValue({ data: buildLearningPath(2) });
  mockedPost.mockRejectedValue({
    statusCode: 403,
    message: "Request failed",
    serverError: { message: "Lesson is locked" },
  });
  const screen = await renderApp("/learn");

  await screen.getByRole("button", { name: "In-order, up next" }).click();
  await page.getByRole("button", { name: "Start lesson" }).click();

  await expect.element(page.getByRole("alert")).toHaveTextContent("Lesson is locked");
  await expect.element(page.getByRole("button", { name: "Start lesson" })).toBeEnabled();
  expect(page.getByRole("progressbar", { name: "Lesson progress" }).elements()).toHaveLength(0);
});

it("goes to the test page for a locked lesson", async () => {
  mockedGet.mockResolvedValue({ data: buildLearningPath(2) });
  mockedPost.mockResolvedValue({
    data: {
      data: {
        attempt: {
          id: "20000000-0000-4000-8000-000000000001",
          lessonId: lessonIdAt(7),
          kind: "lesson_test",
          topic: null,
          status: "in_progress",
          total: 5,
          answeredCount: 0,
          startedAt: "2026-11-11T10:00:00.000Z",
          finishedAt: null,
        },
        question: {
          id: "30000000-0000-4000-8000-000000000001",
          position: 1,
          type: "text",
          prompt: "Name the rotation.",
          tree: null,
          difficulty: 1,
          hints: [],
          hintsTotal: 3,
          hintsRemaining: 3,
        },
        result: null,
      },
    },
  });
  const screen = await renderApp("/learn");

  await screen.getByRole("button", { name: "Single rotations, locked" }).click();
  await page.getByRole("button", { name: "Take the test to skip ahead" }).click();

  await expect.element(screen.getByRole("heading", { name: "Test", level: 1 })).toBeVisible();
  await expect.element(screen.getByText("Question 1 of 5")).toBeVisible();
  expect(mockedPost).toHaveBeenCalledWith(`/api/lessons/${lessonIdAt(7)}/attempts`);
});

it("goes to the lesson page to review a done lesson", async () => {
  serveMapAndLessons(2);
  const screen = await renderApp("/learn");

  await screen.getByRole("button", { name: "Pre-order, completed" }).click();
  await page.getByRole("button", { name: "Review lesson" }).click();

  await expect.element(screen.getByRole("progressbar", { name: "Lesson progress" })).toBeVisible();
  expect(mockedPost).not.toHaveBeenCalled();
});

it("clears the start error when another lesson is opened", async () => {
  mockedGet.mockResolvedValue({ data: buildLearningPath(2) });
  mockedPost.mockRejectedValue({
    statusCode: 403,
    message: "Request failed",
    serverError: { message: "Lesson is locked" },
  });
  const screen = await renderApp("/learn");

  await screen.getByRole("button", { name: "In-order, up next" }).click();
  await page.getByRole("button", { name: "Start lesson" }).click();
  await expect.element(page.getByRole("alert")).toHaveTextContent("Lesson is locked");
  await page.getByRole("button", { name: "Close" }).click();
  await screen.getByRole("button", { name: "Pre-order, completed" }).click();

  await expect.element(page.getByRole("button", { name: "Review lesson" })).toBeVisible();
  await expect.element(page.getByRole("alert")).not.toBeInTheDocument();
});

it("shows an empty state instead of a finished message when there are no lessons", async () => {
  mockedGet.mockResolvedValue({
    data: { data: { units: [], progress: 0, currentLessonId: null } },
  });
  const screen = await renderApp("/learn");

  await expect.element(screen.getByText("No lessons yet")).toBeVisible();
  await expect
    .element(screen.getByText("You've finished every lesson.", { exact: false }))
    .not.toBeInTheDocument();
});
