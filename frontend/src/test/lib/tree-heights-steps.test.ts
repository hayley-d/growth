import { expect, it } from "vitest";

import { treeHeightsSteps } from "@/lib/tree-heights-steps";

const keys = [8, 4, 12, 2, 6, 10, 14];

it("starts with no heights, then works out one node per step in post-order", () => {
  const { steps } = treeHeightsSteps(keys);

  expect(steps).toHaveLength(8);
  expect(steps[0]).toEqual({ heights: {}, currentKey: null, leftHeight: 0, rightHeight: 0 });
  expect(steps.map((step) => step.currentKey)).toEqual([null, 2, 6, 4, 10, 14, 12, 8]);
});

it("gives a leaf height 1 from two empty children", () => {
  const { steps } = treeHeightsSteps(keys);

  expect(steps[1]).toMatchObject({ currentKey: 2, leftHeight: 0, rightHeight: 0 });
  expect(steps[1]?.heights).toEqual({ 2: 1 });
});

it("takes 1 more than the taller subtree", () => {
  const { steps } = treeHeightsSteps([20, 10, 30, 5]);
  const root = steps.at(-1);

  expect(root).toMatchObject({ currentKey: 20, leftHeight: 2, rightHeight: 1 });
  expect(root?.heights).toEqual({ 5: 1, 10: 2, 30: 1, 20: 3 });
});

it("has no steps for an empty tree", () => {
  const { root, steps } = treeHeightsSteps([]);

  expect(root).toBeNull();
  expect(steps).toHaveLength(1);
});
