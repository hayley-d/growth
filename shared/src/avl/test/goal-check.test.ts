import { describe, expect, it } from "vitest";

import { type AvlNode, checkGoal, insertKey } from "@shared/avl";

const build = (keys: number[]) =>
  keys.reduce<AvlNode | null>((root, key) => insertKey(root, key), null);

describe("checkGoal", () => {
  const root = build([20, 10, 30, 5, 15]);

  it("passes containsKeys when every key is in the tree", () => {
    expect(checkGoal(root, { kind: "containsKeys", keys: [10, 30] })).toBe(true);
  });

  it("fails containsKeys when a key is missing", () => {
    expect(checkGoal(root, { kind: "containsKeys", keys: [10, 99] })).toBe(false);
  });

  it("passes traversal when the order matches", () => {
    expect(
      checkGoal(root, { kind: "traversal", order: "inorder", keys: [5, 10, 15, 20, 30] }),
    ).toBe(true);
  });

  it("fails traversal when the order doesn't match", () => {
    expect(
      checkGoal(root, { kind: "traversal", order: "preorder", keys: [5, 10, 15, 20, 30] }),
    ).toBe(false);
  });

  it("passes validAvl for a balanced tree", () => {
    expect(checkGoal(root, { kind: "validAvl" })).toBe(true);
  });

  it("fails validAvl for a tree that is a valid BST but not balanced", () => {
    const unbalanced: AvlNode = {
      key: 30,
      height: 3,
      left: null,
      right: {
        key: 40,
        height: 2,
        left: null,
        right: { key: 50, height: 1, left: null, right: null },
      },
    };
    expect(checkGoal(unbalanced, { kind: "validAvl" })).toBe(false);
  });

  it("passes every goal kind for an empty tree except containsKeys with keys", () => {
    expect(checkGoal(null, { kind: "validAvl" })).toBe(true);
    expect(checkGoal(null, { kind: "traversal", order: "inorder", keys: [] })).toBe(true);
    expect(checkGoal(null, { kind: "containsKeys", keys: [] })).toBe(true);
    expect(checkGoal(null, { kind: "containsKeys", keys: [1] })).toBe(false);
  });
});
