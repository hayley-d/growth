import { expect, it } from "vitest";

import { deleteTreeSteps } from "@/lib/delete-tree-steps";

const keys = [8, 4, 12, 2, 6, 10, 14];

it("starts with nothing deleted, then deletes one node per step in post-order", () => {
  const { steps } = deleteTreeSteps(keys);

  expect(steps).toHaveLength(8);
  expect(steps[0]).toEqual({ deletedKeys: [], currentKey: null, childKeys: [] });
  expect(steps.map((step) => step.currentKey)).toEqual([null, 2, 6, 4, 10, 14, 12, 8]);
  expect(steps[3]?.deletedKeys).toEqual([2, 6, 4]);
});

it("gives each node the children that were deleted before it", () => {
  const { steps } = deleteTreeSteps(keys);

  expect(steps[1]?.childKeys).toEqual([]);
  expect(steps[3]?.childKeys).toEqual([2, 6]);
  expect(steps[7]?.childKeys).toEqual([4, 12]);
});

it("has no steps to delete for an empty tree", () => {
  const { root, steps } = deleteTreeSteps([]);

  expect(root).toBeNull();
  expect(steps).toHaveLength(1);
});
