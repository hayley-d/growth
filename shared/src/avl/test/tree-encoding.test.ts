import { describe, expect, it } from "vitest";

import {
  type AvlNode,
  decodeTree,
  encodeTree,
  insertKey,
  maxTreeNodes,
  removeKey,
  TreeEncodingError,
} from "@shared/avl";

const build = (keys: number[]) =>
  keys.reduce<AvlNode | null>((root, key) => insertKey(root, key), null);

const leaf = (key: number): AvlNode => ({ key, height: 1, left: null, right: null });

const chainOf = (size: number) =>
  [...Array.from({ length: size }, (_value, index) => `${index + 1},#`), "#"].join(",");

describe("encodeTree", () => {
  it("writes keys in pre-order with a marker for each empty child", () => {
    expect(encodeTree(build([20, 10, 30]))).toBe("20,10,#,#,30,#,#");
  });

  it("writes an empty tree as a single marker", () => {
    expect(encodeTree(null)).toBe("#");
  });

  it("tells apart trees with the same pre-order keys but different shapes", () => {
    const withLeftChild: AvlNode = { key: 5, height: 2, left: leaf(10), right: null };
    const withRightChild: AvlNode = { key: 5, height: 2, left: null, right: leaf(10) };
    expect(encodeTree(withLeftChild)).not.toBe(encodeTree(withRightChild));
  });
});

describe("decodeTree", () => {
  it("reads a tree back with its heights", () => {
    expect(decodeTree("20,10,#,#,30,#,#")).toEqual(build([20, 10, 30]));
  });

  it("reads a single marker as an empty tree", () => {
    expect(decodeTree("#")).toBeNull();
  });

  it("reads a tree that breaks BST order", () => {
    expect(decodeTree("5,10,#,#,#")).toEqual({ key: 5, height: 2, left: leaf(10), right: null });
  });

  it("gives back the same tree after encoding", () => {
    let seed = 11;
    const random = () => {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      return seed / 2147483648;
    };
    let root: AvlNode | null = null;
    for (let step = 0; step < 300; step += 1) {
      const key = Math.floor(random() * 80) - 20;
      root = random() < 0.7 ? insertKey(root, key) : removeKey(root, key);
      expect(decodeTree(encodeTree(root))).toEqual(root);
    }
  });

  it("reads a lopsided tree with the most nodes allowed", () => {
    const root = decodeTree(chainOf(maxTreeNodes));
    expect(root?.height).toBe(maxTreeNodes);
  });

  it("throws a TreeEncodingError on a tree with too many nodes", () => {
    expect(() => decodeTree(chainOf(maxTreeNodes + 1))).toThrow(TreeEncodingError);
    expect(() => decodeTree(chainOf(maxTreeNodes + 1))).toThrow("more than 1000 nodes");
  });

  it("reads negative and decimal keys", () => {
    expect(decodeTree("-3.5,#,#")).toEqual(leaf(-3.5));
  });

  it.each([
    ["an invalid key", "20,x,#,#,#", "invalid key"],
    ["an empty key", "20,,#,#", "invalid key"],
    ["a key with spaces", " 20,#,#", "invalid key"],
    ["a key in another spelling", "1.0,#,#", "invalid key"],
    ["a hex key", "0x10,#,#", "invalid key"],
    ["an infinite key", "Infinity,#,#", "invalid key"],
    ["an empty string", "", "invalid key"],
    ["too few values", "20,#", "ends too early"],
    ["extra values", "#,#", "extra values"],
  ])("throws a TreeEncodingError on %s", (_name, text, message) => {
    expect(() => decodeTree(text)).toThrow(TreeEncodingError);
    expect(() => decodeTree(text)).toThrow(message);
  });
});
