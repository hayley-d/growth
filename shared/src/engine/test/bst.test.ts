import { describe, expect, it } from "vitest";

import { type AvlNode, toKeys } from "@shared/avl";
import { insertBst, isAvl, removeBst } from "@shared/engine";

const build = (keys: number[]): AvlNode => {
  const [first, ...rest] = keys;
  if (first === undefined) throw new Error("empty");
  return rest.reduce<AvlNode>(insertBst, insertBst(null, first));
};

describe("insertBst", () => {
  it("does not rebalance a left chain", () => {
    const root = build([30, 20, 10]);
    expect(root.key).toBe(30);
    expect(root.left?.key).toBe(20);
    expect(root.left?.left?.key).toBe(10);
    expect(root.right).toBeNull();
    expect(isAvl(root)).toBe(false);
  });

  it("keeps the same keys when the key is already present", () => {
    const root = build([2, 1, 3]);
    expect(toKeys(insertBst(root, 2))).toEqual([1, 2, 3]);
  });
});

describe("removeBst", () => {
  it("replaces a node that has two children with its successor and does not rebalance", () => {
    const root = removeBst(build([10, 5, 20, 15, 30, 40, 50]), 10);
    expect(root?.key).toBe(15);
    expect(toKeys(root)).toEqual([5, 15, 20, 30, 40, 50]);
    expect(isAvl(root)).toBe(false);
  });

  it("keeps the same keys when the key is missing", () => {
    const root = build([1, 2, 3]);
    expect(toKeys(removeBst(root, 9))).toEqual([1, 2, 3]);
    expect(removeBst(root, 9)).not.toBe(root);
  });
});
