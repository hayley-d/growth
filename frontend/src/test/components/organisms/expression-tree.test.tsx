import { expect, it } from "vitest";
import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";

import type { ExpressionNode } from "@shared/schemas";
import { ExpressionTree } from "@/components/organisms/expression-tree";
import "@/index.css";

const expression: ExpressionNode = {
  operator: "+",
  left: { operator: "×", left: { value: 2 }, right: { value: 3 } },
  right: { value: 4 },
};
const caption = "2 × 3 + 4 in pre-order is + × 2 3 4.";

const renderExpression = (order: "preorder" | "postorder" = "preorder") =>
  render(
    <div className="w-[640px]">
      <ExpressionTree expression={expression} order={order} caption={caption} />
    </div>,
  );

const written = (container: HTMLElement) =>
  [...container.querySelectorAll("ol[aria-label='Written so far'] li")].map(
    (item) => item.textContent,
  );

it("draws the operators and values in the tree", async () => {
  const screen = await renderExpression();
  const texts = [...screen.container.querySelectorAll("svg text")].map((node) => node.textContent);

  expect(texts).toEqual(expect.arrayContaining(["+", "×", "2", "3", "4"]));
  await expect.element(screen.getByText("Press Step to start.")).toBeVisible();
  await expect.element(screen.getByText(caption)).toBeVisible();
  await expect.element(screen.getByText("0 of 5")).toBeVisible();
});

it("visits one node per step and writes it down", async () => {
  const screen = await renderExpression();
  const step = screen.getByRole("button", { name: "Step" });

  await step.click();
  await expect.element(screen.getByText("Visit +.")).toBeVisible();
  await step.click();
  await step.click();
  await expect.element(screen.getByText("Visit 2.")).toBeVisible();
  expect(written(screen.container)).toEqual(["+", "×", "2"]);
});

it("names the notation when every node is visited", async () => {
  const screen = await renderExpression();
  const step = screen.getByRole("button", { name: "Step" });

  for (let index = 0; index < 5; index += 1) await step.click();

  await expect
    .element(screen.getByText("Visit 4. The prefix notation is + × 2 3 4."))
    .toBeVisible();
  await expect.element(step).toHaveAttribute("aria-disabled", "true");
  await expect.element(screen.getByText("Prefix:")).toBeVisible();
});

it("follows the block's order", async () => {
  const screen = await renderExpression("postorder");
  const step = screen.getByRole("button", { name: "Step" });

  for (let index = 0; index < 5; index += 1) await step.click();

  await expect
    .element(screen.getByText("Visit +. The postfix notation is 2 3 × 4 +."))
    .toBeVisible();
});

it("moves with the arrow keys", async () => {
  const screen = await renderExpression();

  await screen.getByRole("button", { name: "Step" }).click();
  await userEvent.keyboard("{ArrowRight}");
  await expect.element(screen.getByText("Visit ×.")).toBeVisible();
});
