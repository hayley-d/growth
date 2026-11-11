import { expect, it } from "vitest";

import { toKeys } from "@shared/avl";
import { copyTreeSteps, trimTree } from "@/lib/copy-tree-steps";

const keys = [8, 4, 12, 2, 6, 10, 14];

it("starts with nothing copied, then copies one node per step in pre-order", () => {
  const { steps } = copyTreeSteps(keys);

  expect(steps).toHaveLength(8);
  expect(steps[0]).toEqual({ copiedKeys: [], currentKey: null, parentKey: null });
  expect(steps.map((step) => step.currentKey)).toEqual([null, 8, 4, 2, 6, 12, 10, 14]);
  expect(steps[3]?.copiedKeys).toEqual([8, 4, 2]);
});

it("gives each copied node the parent it hangs under", () => {
  const { steps } = copyTreeSteps(keys);

  expect(steps.map((step) => step.parentKey)).toEqual([null, null, 8, 4, 4, 8, 12, 12]);
});

it("builds the original tree from the keys", () => {
  const { root } = copyTreeSteps(keys);

  expect(toKeys(root)).toEqual([2, 4, 6, 8, 10, 12, 14]);
  expect(root?.key).toBe(8);
});

it("has no steps to copy for an empty tree", () => {
  const { root, steps } = copyTreeSteps([]);

  expect(root).toBeNull();
  expect(steps).toEqual([{ copiedKeys: [], currentKey: null, parentKey: null }]);
});

it("trims a tree down to the copied keys, keeping their places", () => {
  const { root } = copyTreeSteps(keys);
  const trimmed = trimTree(root, [8, 4, 2]);

  expect(trimmed?.key).toBe(8);
  expect(trimmed?.left?.key).toBe(4);
  expect(trimmed?.left?.left?.key).toBe(2);
  expect(trimmed?.left?.right).toBeNull();
  expect(trimmed?.right).toBeNull();
  expect(trimTree(root, [])).toBeNull();
});
