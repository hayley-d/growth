import { expect, it } from "vitest";

import { toKeys } from "@shared/avl";
import { animationSteps, buildTree, operationLabel } from "@/lib/lesson/animation-steps";

it("builds the starting tree from the keys", () => {
  expect(toKeys(buildTree([8, 4, 12]))).toEqual([4, 8, 12]);
  expect(buildTree([])).toBeNull();
});

it("joins the steps of every operation and marks where each one starts and ends", () => {
  const run = animationSteps(
    [8],
    [
      { operation: "insert", key: 4 },
      { operation: "insert", key: 12 },
    ],
  );

  expect(run.marks).toHaveLength(2);
  const [first, second] = run.marks;
  expect(first?.startIndex).toBe(0);
  expect(second?.startIndex).toBe((first?.endIndex ?? 0) + 1);
  expect(second?.endIndex).toBe(run.steps.length - 1);
  expect(toKeys(run.steps.at(-1)?.tree ?? null)).toEqual([4, 8, 12]);
});

it("runs each operation on the tree the one before it left", () => {
  const run = animationSteps(
    [8, 4],
    [
      { operation: "delete", key: 4 },
      { operation: "search", key: 4 },
    ],
  );

  expect(toKeys(run.steps.at(-1)?.tree ?? null)).toEqual([8]);
});

it("names each operation", () => {
  expect(operationLabel({ operation: "insert", key: 4 })).toBe("insert 4");
  expect(operationLabel({ operation: "search", key: 9 })).toBe("search for 9");
});

it("in bst mode, inserts with no height, balance or rotation steps", () => {
  const run = animationSteps(
    [],
    [
      { operation: "insert", key: 8 },
      { operation: "insert", key: 4 },
      { operation: "insert", key: 2 },
    ],
    "bst",
  );

  const avlSteps = run.steps.filter(
    (step) =>
      /^(update-height|rebalance|rotate-left|rotate-right)\./.test(step.stepKey) ||
      /\.(update-height|rebalance)$/.test(step.stepKey),
  );
  expect(avlSteps).toEqual([]);
  expect(run.steps.some((step) => /balance/i.test(step.message))).toBe(false);
  const last = run.steps.at(-1)?.tree ?? null;
  expect(last?.key).toBe(8);
  expect(last?.left?.left?.key).toBe(2);
});

it("in bst mode, keeps the starting tree in insertion order", () => {
  const tree = buildTree([1, 2, 3], "bst");
  expect(tree?.key).toBe(1);
  expect(tree?.right?.right?.key).toBe(3);
  expect(buildTree([1, 2, 3])?.key).toBe(2);
});
