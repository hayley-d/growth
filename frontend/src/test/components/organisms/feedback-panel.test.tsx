import { expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { type AvlNode, insertKey } from "@shared/avl";
import { FeedbackPanel } from "@/components/organisms/feedback-panel";
import "@/index.css";

const treeOf = (keys: number[]) =>
  keys.reduce<AvlNode | null>((node, key) => insertKey(node, key), null);

it("keeps the question's tree beside the explanation when there is no replay", async () => {
  const screen = await render(
    <FeedbackPanel
      isCorrect={false}
      explanation="The longest path is 8, 4, 2."
      replay={null}
      root={treeOf([8, 4, 12, 2])}
      runKey="question"
      isLast={false}
    />,
  );

  await expect.element(screen.getByText("The longest path is 8, 4, 2.")).toBeVisible();
  await expect.element(screen.getByRole("img", { name: "Tree" })).toBeVisible();
});

it("shows no tree when the question had none", async () => {
  const screen = await render(
    <FeedbackPanel
      isCorrect
      explanation="Pre-order visits the root first."
      replay={null}
      root={null}
      runKey="question"
      isLast={false}
    />,
  );

  await expect.element(screen.getByText("Pre-order visits the root first.")).toBeVisible();
  await expect.element(screen.getByRole("img")).not.toBeInTheDocument();
});

it("shows the replay instead of the still tree when there is one", async () => {
  await render(
    <FeedbackPanel
      isCorrect={false}
      explanation="10 goes right of 8."
      replay={{ kind: "operation", operation: "insert", key: 10 }}
      root={treeOf([8, 4])}
      runKey="question"
      isLast={false}
    />,
  );

  expect(document.querySelectorAll('[role="img"]')).toHaveLength(1);
  expect(document.body.textContent).toContain("The correct answer, step by step");
});
