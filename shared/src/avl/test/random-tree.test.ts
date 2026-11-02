import { describe, expect, it } from "vitest";

import { type AvlNode, createRandom, randomTree, toKeys } from "@shared/avl";

const heightOf = (node: AvlNode | null): number =>
  node ? 1 + Math.max(heightOf(node.left), heightOf(node.right)) : 0;

const expectValidAvl = (node: AvlNode | null) => {
  if (!node) return;
  expect(node.height).toBe(heightOf(node));
  expect(Math.abs(heightOf(node.left) - heightOf(node.right))).toBeLessThanOrEqual(1);
  if (node.left) expect(node.left.key).toBeLessThan(node.key);
  if (node.right) expect(node.right.key).toBeGreaterThan(node.key);
  expectValidAvl(node.left);
  expectValidAvl(node.right);
};

describe("randomTree", () => {
  it("rebuilds the same tree from the same seed and size", () => {
    const first = toKeys(randomTree({ size: 8, seed: 42 }));
    const second = toKeys(randomTree({ size: 8, seed: 42 }));
    expect(second).toEqual(first);
    expect(first).toHaveLength(8);
  });

  it("changes the tree when the seed changes", () => {
    const first = toKeys(randomTree({ size: 8, seed: 1 }));
    const second = toKeys(randomTree({ size: 8, seed: 2 }));
    expect(second).not.toEqual(first);
  });

  it("returns an empty tree when size is 0", () => {
    expect(randomTree({ size: 0, seed: 1 })).toBeNull();
  });

  it("inserts distinct keys from 1 to 99 and stays a valid AVL", () => {
    const keys = toKeys(randomTree({ size: 12, seed: 7 }));
    expect(keys).toHaveLength(12);
    expect(new Set(keys).size).toBe(12);
    expect(keys.every((key) => key >= 1 && key <= 99)).toBe(true);
    expectValidAvl(randomTree({ size: 12, seed: 7 }));
  });

  it("stops once every key from 1 to 99 is used", () => {
    expect(toKeys(randomTree({ size: 120, seed: 3 }))).toHaveLength(99);
  });
});

describe("createRandom", () => {
  it("repeats the same sequence for a seed", () => {
    const first = createRandom(5);
    const second = createRandom(5);
    expect([second(), second(), second()]).toEqual([first(), first(), first()]);
  });
});
