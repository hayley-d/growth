import { expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";

import { type AvlNode, encodeTree, insertKey } from "@shared/avl";
import { removeBst } from "@shared/engine";
import { BuildTreeQuestion } from "@/components/organisms/build-tree-question";
import "@/index.css";

const build = (keys: number[]) =>
  keys.reduce<AvlNode | null>((node, key) => insertKey(node, key), null);

const leaning: AvlNode = {
  key: 30,
  height: 2,
  right: null,
  left: { key: 20, height: 1, left: null, right: null },
};

const renderQuestion = (onSubmit = vi.fn()) =>
  render(
    <div className="w-96">
      <BuildTreeQuestion root={leaning} onSubmit={onSubmit} />
    </div>,
  );

it("inserts a key, rotates the picked node, and submits the encoded tree", async () => {
  const onSubmit = vi.fn();
  const screen = await renderQuestion(onSubmit);

  await screen.getByRole("textbox", { name: "New key" }).fill("10");
  await screen.getByRole("button", { name: "Insert" }).click();
  await screen.getByRole("button", { name: /^30,/ }).click();
  await screen.getByRole("button", { name: "Rotate 30 right" }).click();
  await screen.getByRole("button", { name: "Submit" }).click();

  expect(onSubmit).toHaveBeenCalledWith({
    type: "build_tree",
    tree: encodeTree(build([20, 10, 30])),
  });
});

it("undoes moves, resets, and rejects a key that is already there", async () => {
  const screen = await renderQuestion();

  await screen.getByRole("textbox", { name: "New key" }).fill("20");
  await screen.getByRole("button", { name: "Insert" }).click();
  await expect.element(screen.getByText("20 is already in the tree.")).toBeVisible();
  await expect.element(screen.getByRole("button", { name: "Undo" })).toBeDisabled();

  await screen.getByRole("textbox", { name: "New key" }).fill("10");
  await screen.getByRole("button", { name: "Insert" }).click();
  await expect.element(screen.getByRole("button", { name: /^10,/ })).toBeVisible();

  await screen.getByRole("button", { name: "Undo" }).click();
  await expect.element(screen.getByRole("button", { name: "Reset" })).toBeDisabled();
});

it("drops the selection and the message when a move is undone", async () => {
  const screen = await renderQuestion();

  await screen.getByRole("textbox", { name: "New key" }).fill("10");
  await screen.getByRole("button", { name: "Insert" }).click();
  await screen.getByRole("button", { name: /^10,/ }).click();
  await expect.element(screen.getByRole("button", { name: "Rotate 10 left" })).toBeVisible();

  await screen.getByRole("button", { name: "Undo" }).click();

  expect(screen.container.textContent).not.toContain("Rotate 10");
});

it("tells the learner when a rotation is not possible", async () => {
  const screen = await renderQuestion();

  await screen.getByRole("button", { name: /^20,/ }).click();
  await screen.getByRole("button", { name: "Rotate 20 left" }).click();

  await expect.element(screen.getByText("Node 20 has no right child")).toBeVisible();
});

it("deletes the picked node and submits the encoded tree", async () => {
  const onSubmit = vi.fn();
  const screen = await renderQuestion(onSubmit);

  await screen.getByRole("button", { name: /^20,/ }).click();
  await screen.getByRole("button", { name: "Delete 20" }).click();
  await screen.getByRole("button", { name: "Submit" }).click();

  expect(onSubmit).toHaveBeenCalledWith({ type: "build_tree", tree: encodeTree(build([30])) });
});

it("replaces a node with two children by its successor and undoes the delete", async () => {
  const onSubmit = vi.fn();
  const screen = await render(
    <div className="w-96">
      <BuildTreeQuestion root={build([30, 20, 40, 35])} onSubmit={onSubmit} />
    </div>,
  );

  await screen.getByRole("button", { name: /^30,/ }).click();
  await screen.getByRole("button", { name: "Delete 30" }).click();
  await screen.getByRole("button", { name: "Submit" }).click();

  expect(onSubmit).toHaveBeenLastCalledWith({
    type: "build_tree",
    tree: encodeTree(removeBst(build([30, 20, 40, 35]), 30)),
  });
  expect(encodeTree(removeBst(build([30, 20, 40, 35]), 30)).startsWith("35,")).toBe(true);

  await screen.getByRole("button", { name: "Undo" }).click();
  await expect.element(screen.getByRole("button", { name: /^30,/ })).toBeVisible();
  expect(screen.container.textContent).not.toContain("Delete 30");
});

it("explains how to rotate a node from the info tip", async () => {
  const screen = await renderQuestion();

  await screen.getByRole("button", { name: "How to rotate or delete a node" }).click();

  await expect
    .element(screen.getByText(/Click a node in the tree to pick it/).first())
    .toBeVisible();
});
