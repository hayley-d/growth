import { expect, it } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-react";

import { type AvlNode, encodeTree, insertKey } from "@shared/avl";
import type { AttemptQuestion } from "@shared/schemas";
import { QuestionCard } from "@/components/organisms/question-card";
import "@/index.css";

const tree = [8, 4, 12].reduce<AvlNode | null>((node, key) => insertKey(node, key), null);

const question = {
  id: "10000000-0000-4000-8000-000000000001",
  position: 1,
  type: "multiple_choice",
  prompt: "Which node is the root?",
  tree: encodeTree(tree),
  options: [
    { id: "20000000-0000-4000-8000-000000000001", text: "8" },
    { id: "20000000-0000-4000-8000-000000000002", text: "4" },
  ],
  difficulty: 1,
  hints: [],
  hintsTotal: 2,
  hintsRemaining: 2,
} as AttemptQuestion;

const renderCard = () =>
  render(<QuestionCard question={question} isBusy={false} onSubmit={() => {}} />);

it("puts the tree beside the answers on a wide screen", async () => {
  await page.viewport(1280, 720);
  const screen = await renderCard();

  const treeBox = screen.getByRole("img", { name: "Tree" }).element().getBoundingClientRect();
  const submit = screen.getByRole("button", { name: "Submit" }).element().getBoundingClientRect();

  expect(submit.left).toBeGreaterThanOrEqual(treeBox.right);
  expect(submit.top).toBeLessThan(treeBox.bottom);
});

it("puts the answers under the tree on a phone", async () => {
  await page.viewport(375, 720);
  const screen = await renderCard();

  const treeBox = screen.getByRole("img", { name: "Tree" }).element().getBoundingClientRect();
  const submit = screen.getByRole("button", { name: "Submit" }).element().getBoundingClientRect();

  expect(submit.top).toBeGreaterThanOrEqual(treeBox.bottom);
});
