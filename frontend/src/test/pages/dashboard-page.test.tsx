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
  mockedGet.mockRejectedValueOnce({
    statusCode: 401,
    message: "Request failed",
    serverError: { message: "Unable to load your learning path" },
  });
  mockedGet.mockResolvedValue({ data: buildLearningPath(2) });
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
