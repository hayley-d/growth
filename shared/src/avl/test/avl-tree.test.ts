import { describe, expect, it } from "vitest";

import { type AvlNode, insertKey, layoutTree, removeKey, toKeys } from "@shared/avl";

const build = (keys: number[]) =>
  keys.reduce<AvlNode | null>((root, key) => insertKey(root, key), null);

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

describe("insertKey", () => {
  it.each([
    ["left left", [30, 20, 10]],
    ["right right", [10, 20, 30]],
    ["left right", [30, 10, 20]],
    ["right left", [10, 30, 20]],
  ])("rebalances the %s case with 20 as the new root", (_name, keys) => {
    const root = build(keys);
    expect(root?.key).toBe(20);
    expect(root?.left?.key).toBe(10);
    expect(root?.right?.key).toBe(30);
    expect(root?.height).toBe(2);
  });

  it("ignores a key that is already in the tree", () => {
    expect(toKeys(build([2, 1, 2, 3, 1]))).toEqual([1, 2, 3]);
  });
});

describe("removeKey", () => {
  it("removes a leaf", () => {
    expect(toKeys(removeKey(build([20, 10, 30]), 10))).toEqual([20, 30]);
  });

  it("removes a node with one child", () => {
    const root = removeKey(build([20, 10, 30, 40]), 30);
    expect(toKeys(root)).toEqual([10, 20, 40]);
    expectValidAvl(root);
  });

  it("replaces a node with two children by its in-order successor", () => {
    const root = removeKey(build([20, 10, 30, 25, 40]), 20);
    expect(root?.key).toBe(25);
    expect(toKeys(root)).toEqual([10, 25, 30, 40]);
    expectValidAvl(root);
  });

  it("rebalances after a removal", () => {
    const root = removeKey(build([20, 10, 30, 40]), 10);
    expect(root?.key).toBe(30);
    expectValidAvl(root);
  });

  it("leaves the tree alone when the key is missing", () => {
    expect(toKeys(removeKey(build([1, 2, 3]), 9))).toEqual([1, 2, 3]);
  });
});

it("stays a valid AVL tree through many random inserts and removes", () => {
  let seed = 7;
  const random = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  let root: AvlNode | null = null;
  const present = new Set<number>();
  for (let step = 0; step < 500; step += 1) {
    const key = Math.floor(random() * 60);
    if (random() < 0.6) {
      root = insertKey(root, key);
      present.add(key);
    } else {
      root = removeKey(root, key);
      present.delete(key);
    }
    expectValidAvl(root);
    expect(toKeys(root)).toEqual([...present].sort((first, second) => first - second));
  }
});

describe("layoutTree", () => {
  it("places keys left to right in order with depth as y", () => {
    const layout = layoutTree(build([20, 10, 30, 5]));
    expect(layout.map((position) => position.key)).toEqual([5, 10, 20, 30]);
    expect(layout.map((position) => position.x)).toEqual([0, 1, 2, 3]);
    expect(layout.find((position) => position.key === 20)).toMatchObject({ y: 0, parentKey: null });
    expect(layout.find((position) => position.key === 5)).toMatchObject({ y: 2, parentKey: 10 });
  });

  it("returns nothing for an empty tree", () => {
    expect(layoutTree(null)).toEqual([]);
  });
});
