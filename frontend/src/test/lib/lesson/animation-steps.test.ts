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
