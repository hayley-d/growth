import { describe, expect, it } from "vitest";

import { type AvlNode, insertKey, TreeSearcher } from "@shared/avl";

const build = (keys: number[]) =>
  keys.reduce<AvlNode | null>((root, key) => insertKey(root, key), null);

const keysOf = (nodes: AvlNode[]) => nodes.map((node) => node.key);

describe("TreeSearcher", () => {
  const root = build([20, 10, 30, 5, 15, 25, 40]);
  const searcher = new TreeSearcher(root);

  it("finds the root with no moves", () => {
    expect(searcher.solve(20)).toBe(root);
    expect(keysOf(searcher.getSearchPath(20))).toEqual([20]);
    expect(searcher.getSearchMoves(20)).toEqual([]);
  });

  it("finds a deep key and records the path to it", () => {
    expect(searcher.solve(15)?.key).toBe(15);
    expect(keysOf(searcher.getSearchPath(15))).toEqual([20, 10, 15]);
    expect(searcher.getSearchMoves(15)).toEqual(["left", "right"]);
    expect(searcher.getSearchMoves(25)).toEqual(["right", "left"]);
  });

  it("stops at the last node checked when the key is missing", () => {
    expect(searcher.solve(27)).toBeNull();
    expect(keysOf(searcher.getSearchPath(27))).toEqual([20, 30, 25]);
    expect(searcher.getSearchMoves(27)).toEqual(["right", "left"]);
  });

  it("finds nothing in an empty tree", () => {
    const empty = new TreeSearcher(null);
    expect(empty.solve(1)).toBeNull();
    expect(empty.getSearchPath(1)).toEqual([]);
    expect(empty.getSearchMoves(1)).toEqual([]);
  });
});
