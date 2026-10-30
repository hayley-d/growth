import { describe, expect, it } from "vitest";

import { type AvlNode, insertKey, TreeSearcher, traceSearch } from "@shared/avl";

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

describe("traceSearch", () => {
  const root = build([20, 10, 30, 5, 15]);

  it("compares at each node, moves, and stops on a match", () => {
    const traced = traceSearch(root, 15);
    expect(traced.result?.key).toBe(15);
    expect(traced.steps.map((step) => step.stepKey)).toEqual([
      "search.compare",
      "search.go-left",
      "search.compare",
      "search.go-right",
      "search.compare",
      "search.found",
    ]);
    expect(traced.steps[1]?.message).toBe("15 is smaller than 20, so go left.");
    expect(traced.steps.at(-1)?.nodeStates).toEqual({ 20: "visited", 10: "visited", 15: "active" });
  });

  it("reports a missing key after the last move", () => {
    const traced = traceSearch(root, 12);
    expect(traced.result).toBeNull();
    expect(traced.steps.map((step) => step.stepKey).slice(-2)).toEqual([
      "search.go-left",
      "search.not-found",
    ]);
  });

  it("reports a missing key straight away in an empty tree", () => {
    expect(traceSearch(null, 1).steps.map((step) => step.stepKey)).toEqual(["search.not-found"]);
  });
});
