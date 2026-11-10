import { expect, it } from "vitest";
import type { Locator } from "vitest/browser";

import { renderApp } from "@/test/render-app";

const choose = async (
  screen: { getByLabelText: (label: string) => Locator; getByRole: Locator["getByRole"] },
  label: string,
  option: string,
) => {
  await screen.getByLabelText(label).click();
  await screen.getByRole("option", { name: option }).click();
};

it("asks one question at a time, then starts the playground", async () => {
  const screen = await renderApp("/playground");

  await expect.element(screen.getByRole("heading", { name: "Playground", level: 1 })).toBeVisible();
  await expect.element(screen.getByLabelText("What topic?")).toBeVisible();
  expect(screen.getByLabelText("How do you want to explore?").query()).toBeNull();

  await choose(screen, "What topic?", "Traversals");
  await expect.element(screen.getByLabelText("What traversal?")).toBeVisible();
  expect(screen.getByLabelText("How do you want to explore?").query()).toBeNull();

  await choose(screen, "What traversal?", "Post-order");
  await choose(screen, "How do you want to explore?", "Watch it run");
  expect(screen.getByRole("button", { name: "Start" }).query()).toBeNull();

  await choose(screen, "What tree do you want to start with?", "An empty tree");
  await screen.getByRole("button", { name: "Start" }).click();

  await expect
    .element(screen.getByRole("button", { name: "Walk the tree post-order" }))
    .toBeVisible();
  await expect
    .element(screen.getByRole("listitem").filter({ hasText: "Post-order" }))
    .toBeVisible();
});

it("skips the traversal question for tree building", async () => {
  const screen = await renderApp("/playground");

  await choose(screen, "What topic?", "Tree building");

  await expect.element(screen.getByLabelText("How do you want to explore?")).toBeVisible();
  expect(screen.getByLabelText("What traversal?").query()).toBeNull();
});

it("keeps the answers when coming back to change the setup", async () => {
  const screen = await renderApp("/playground?topic=avl&explore=interact&start=small&seed=4");

  await expect.element(screen.getByLabelText("What topic?")).toHaveTextContent("Tree building");
  await expect
    .element(screen.getByLabelText("What tree do you want to start with?"))
    .toHaveTextContent("A small random tree");
  await expect.element(screen.getByRole("button", { name: "Start" })).toBeVisible();
});
