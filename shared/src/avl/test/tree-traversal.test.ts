import { describe, expect, it } from "vitest";

import { type AvlNode, insertKey, TreeTraversal, toKeys, traceTraversal } from "@shared/avl";

const build = (keys: number[]) =>
  keys.reduce<AvlNode | null>((root, key) => insertKey(root, key), null);

const keysOf = (nodes: Iterable<AvlNode>) => [...nodes].map((node) => node.key);

describe("TreeTraversal", () => {
  const root = build([20, 10, 30, 5, 15]);

  it.each([
    ["preorder", [20, 10, 5, 15, 30]],
    ["inorder", [5, 10, 15, 20, 30]],
    ["postorder", [5, 15, 10, 30, 20]],
    ["levelorder", [20, 10, 30, 5, 15]],
  ] as const)("walks the tree in %s order", (order, expected) => {
    expect(keysOf(new TreeTraversal(root, order))).toEqual(expected);
  });

  it("returns null and reports the end after the last node", () => {
    const traversal = new TreeTraversal(build([2, 1, 3]), "inorder");
    expect(traversal.next()?.key).toBe(1);
    expect(traversal.next()?.key).toBe(2);
    expect(traversal.reachedEnd()).toBe(false);
    expect(traversal.next()?.key).toBe(3);
    expect(traversal.reachedEnd()).toBe(true);
    expect(traversal.next()).toBeNull();
  });

  it("ends straight away for an empty tree", () => {
    const traversal = new TreeTraversal(null, "preorder");
    expect(traversal.reachedEnd()).toBe(true);
    expect(traversal.next()).toBeNull();
  });

  it("starts again after reset", () => {
    const traversal = new TreeTraversal(root, "preorder");
    keysOf(traversal);
    expect(traversal.reachedEnd()).toBe(true);
    traversal.reset();
    expect(traversal.reachedEnd()).toBe(false);
    expect(traversal.next()?.key).toBe(20);
  });

  it("gives the same nodes when spread as when stepped with next", () => {
    const stepped: AvlNode[] = [];
    const traversal = new TreeTraversal(root, "postorder");
    while (!traversal.reachedEnd()) {
      const node = traversal.next();
      if (node) stepped.push(node);
    }
    expect([...new TreeTraversal(root, "postorder")]).toEqual(stepped);
  });

  it("spreads only the nodes left after stepping with next", () => {
    const traversal = new TreeTraversal(root, "inorder");
    traversal.next();
    traversal.next();
    expect(keysOf(traversal)).toEqual([15, 20, 30]);
    expect(keysOf(traversal)).toEqual([]);
  });

  it("matches toKeys in order on a larger tree", () => {
    const keys = Array.from({ length: 50 }, (_value, index) => (index * 37) % 101);
    const larger = build(keys);
    expect(keysOf(new TreeTraversal(larger, "inorder"))).toEqual(toKeys(larger));
  });
});

describe("traceTraversal", () => {
  const root = build([20, 10, 30, 5, 15]);

  it.each(["preorder", "inorder", "postorder", "levelorder"] as const)(
    "returns the same keys as TreeTraversal in %s order",
    (order) => {
      expect(traceTraversal(root, order).result).toEqual(keysOf(new TreeTraversal(root, order)));
    },
  );

  it("emits a visit step for each node, keyed by the order", () => {
    const visits = traceTraversal(root, "inorder").steps.filter(
      (step) => step.stepKey === "inorder.visit",
    );
    expect(visits.map((step) => step.variables.node)).toEqual([5, 10, 15, 20, 30]);
  });

  it("goes left, visits, then goes right for in-order on a single node", () => {
    expect(traceTraversal(build([1]), "inorder").steps.map((step) => step.stepKey)).toEqual([
      "inorder.go-left",
      "inorder.empty",
      "inorder.visit",
      "inorder.go-right",
      "inorder.empty",
    ]);
  });

  it("queues children in level order", () => {
    expect(
      traceTraversal(build([2, 1, 3]), "levelorder").steps.map((step) => step.stepKey),
    ).toEqual([
      "levelorder.enqueue-root",
      "levelorder.dequeue",
      "levelorder.visit",
      "levelorder.enqueue-left",
      "levelorder.enqueue-right",
      "levelorder.dequeue",
      "levelorder.visit",
      "levelorder.dequeue",
      "levelorder.visit",
      "levelorder.done",
    ]);
  });

  it("finishes straight away on an empty tree", () => {
    expect(traceTraversal(null, "levelorder").steps.map((step) => step.stepKey)).toEqual([
      "levelorder.done",
    ]);
  });
});
