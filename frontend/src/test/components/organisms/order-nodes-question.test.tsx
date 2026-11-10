import { expect, it, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";

import { type AvlNode, insertKey } from "@shared/avl";
import { OrderNodesQuestion } from "@/components/organisms/order-nodes-question";
import "@/index.css";

const build = (keys: number[]) =>
  keys.reduce<AvlNode | null>((node, key) => insertKey(node, key), null);

const renderQuestion = (onSubmit = vi.fn(), disabled = false) =>
  render(
    <div className="w-96">
      <OrderNodesQuestion root={build([20, 10, 30])} disabled={disabled} onSubmit={onSubmit} />
    </div>,
  );

it("numbers each pick on the tree and in the list, then submits the order", async () => {
  const onSubmit = vi.fn();
  const screen = await renderQuestion(onSubmit);

  await screen.getByRole("button", { name: /^20,/ }).click();
  await screen.getByRole("button", { name: /^10,/ }).click();
  await expect.element(screen.getByRole("button", { name: /^20,.*number 1/ })).toBeVisible();
  await expect.element(screen.getByRole("list", { name: "Your order" })).toBeVisible();
  await expect.element(screen.getByRole("button", { name: "Submit" })).toBeDisabled();

  await screen.getByRole("button", { name: /^30,/ }).click();
  await screen.getByRole("button", { name: "Submit" }).click();

  expect(onSubmit).toHaveBeenCalledWith({ type: "order_nodes", keys: [20, 10, 30] });
});

it("ignores a node that is already picked, and undo and clear take picks back", async () => {
  const screen = await renderQuestion();

  await screen.getByRole("button", { name: /^20,/ }).click();
  await screen.getByRole("button", { name: /^20,/ }).click();
  await screen.getByRole("button", { name: /^10,/ }).click();
  await screen.getByRole("button", { name: "Undo" }).click();
  await expect.element(screen.getByRole("button", { name: /^10,(?!.*number)/ })).toBeVisible();

  await screen.getByRole("button", { name: "Clear" }).click();
  await expect.element(screen.getByRole("button", { name: "Undo" })).toBeDisabled();
});

it("marks a picked node as pressed", async () => {
  const screen = await renderQuestion();

  await screen.getByRole("button", { name: /^20,/ }).click();

  await expect
    .element(screen.getByRole("button", { name: /^20,/ }))
    .toHaveAttribute("aria-pressed", "true");
  await expect
    .element(screen.getByRole("button", { name: /^10,/ }))
    .toHaveAttribute("aria-pressed", "false");
});

it("picks a node with the keyboard", async () => {
  const screen = await renderQuestion();

  screen.getByRole("button", { name: /^10,/ }).element().focus();
  await userEvent.keyboard("{Enter}");

  await expect.element(screen.getByRole("button", { name: /^10,.*number 1/ })).toBeVisible();
});

it("takes no picks when disabled", async () => {
  const screen = await renderQuestion(vi.fn(), true);

  await screen.getByRole("button", { name: /^20,/ }).click();

  await expect.element(screen.getByRole("button", { name: "Undo" })).toBeDisabled();
});
