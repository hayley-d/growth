import { describe, expect, it } from "vitest";

import type { AvlNode } from "@shared/avl";
import { findUnbalanced, insertBst, isAvl } from "@shared/engine";

const build = (keys: number[]): AvlNode => {
  const [first, ...rest] = keys;
  if (first === undefined) throw new Error("empty");
  return rest.reduce<AvlNode>(insertBst, insertBst(null, first));
};

const node = (key: number, left: AvlNode | null, right: AvlNode | null): AvlNode => ({
  key,
  left,
  right,
  height: 1 + Math.max(left?.height ?? 0, right?.height ?? 0),
});

describe("findUnbalanced", () => {
  it("returns the nodes whose balance factor is outside -1 to 1", () => {
    const root = build([30, 20, 10]);
    expect(findUnbalanced(root).map((unbalanced) => unbalanced.key)).toEqual([30]);
  });

  it("returns nothing for an empty tree", () => {
    expect(findUnbalanced(null)).toEqual([]);
  });
});

describe("isAvl", () => {
  it("rejects a left chain", () => {
    expect(isAvl(build([30, 20, 10]))).toBe(false);
  });

  it("rejects 25 in the left subtree of 20", () => {
    const tree = node(20, node(10, null, node(25, null, null)), null);
    expect(isAvl(tree)).toBe(false);
  });

  it("rejects 25 under 10 even when local balance and direct children are ordered", () => {
    const tree = node(20, node(10, null, node(25, null, null)), node(30, null, null));
    expect(isAvl(tree)).toBe(false);
  });

  it("accepts an empty tree", () => {
    expect(isAvl(null)).toBe(true);
  });
});
