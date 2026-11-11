import { afterEach, expect, it, vi } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-react";

import { LearningPathTree } from "@/components/organisms/learning-path-tree";
import { buildLearningPath, lessonIdAt } from "@/test/learning-path-fixture";
import "@/index.css";

afterEach(async () => {
  await page.viewport(1280, 800);
});

const actions = () => ({
  onStartLesson: vi.fn(),
  onReviewLesson: vi.fn(),
  onTakeTest: vi.fn(),
});

it("draws a button for each of the 12 lessons", async () => {
  await page.viewport(1280, 800);
  const screen = await render(
    <LearningPathTree units={buildLearningPath(2).data.units} {...actions()} />,
  );

  await expect
    .element(screen.getByRole("button", { name: "What is a binary tree, completed" }))
    .toBeVisible();
  await expect.element(screen.getByRole("button", { name: "In-order, up next" })).toBeVisible();
  await expect
    .element(screen.getByRole("button", { name: "AVL final challenge, quiz, locked" }))
    .toBeVisible();
  expect(screen.getByRole("button").elements()).toHaveLength(12);
});

it("says where the learner is", async () => {
  await page.viewport(1280, 800);
  const screen = await render(
    <LearningPathTree units={buildLearningPath(2).data.units} {...actions()} />,
  );

  await expect.element(screen.getByText("You are here")).toBeVisible();
  await expect.element(screen.getByText("Quiz 6")).toBeVisible();
});

it("has no up next lesson when every lesson is done", async () => {
  await page.viewport(1280, 800);
  const screen = await render(
    <LearningPathTree units={buildLearningPath(12).data.units} {...actions()} />,
  );

  await expect.element(screen.getByText("You are here")).not.toBeInTheDocument();
  await expect
    .element(screen.getByRole("button", { name: "AVL final challenge, quiz, completed" }))
    .toBeVisible();
});

it("opens the sheet for the lesson that was tapped and starts it", async () => {
  await page.viewport(1280, 800);
  const handlers = actions();
  const screen = await render(
    <LearningPathTree units={buildLearningPath(2).data.units} {...handlers} />,
  );

  await screen.getByRole("button", { name: "In-order, up next" }).click();
  await expect.element(page.getByRole("dialog")).toBeVisible();
  await expect.element(page.getByText("Unit 1 · Binary trees and traversals")).toBeVisible();
  await page.getByRole("button", { name: "Start lesson" }).click();

  expect(handlers.onStartLesson).toHaveBeenCalledWith(lessonIdAt(2));
});

it("offers the test for a locked lesson and a review for a done one", async () => {
  await page.viewport(1280, 800);
  const handlers = actions();
  const screen = await render(
    <LearningPathTree units={buildLearningPath(2).data.units} {...handlers} />,
  );

  await screen.getByRole("button", { name: "Single rotations, locked" }).click();
  await page.getByRole("button", { name: "Take the test to skip ahead" }).click();
  expect(handlers.onTakeTest).toHaveBeenCalledWith(lessonIdAt(7));

  await page.getByRole("button", { name: "Close" }).click();
  await screen.getByRole("button", { name: "Pre-order, completed" }).click();
  await page.getByRole("button", { name: "Review lesson" }).click();
  expect(handlers.onReviewLesson).toHaveBeenCalledWith(lessonIdAt(1));
});

it("lays the tree out down a phone with no sideways scroll", async () => {
  await page.viewport(375, 800);
  const screen = await render(
    <LearningPathTree units={buildLearningPath(2).data.units} {...actions()} />,
  );

  await expect.element(screen.getByRole("button", { name: "In-order, up next" })).toBeVisible();
  expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(375);
});
