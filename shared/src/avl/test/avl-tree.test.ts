import { describe, expect, it } from "vitest";

import {
  type AvlNode,
  buildTreeFromKeys,
  canRotate,
  findNode,
  insertKey,
  layoutTree,
  openSpots,
  parentOf,
  pivotOf,
  removeKey,
  rotateRight,
  type SteppedResult,
  toKeys,
  traceBstInsert,
  traceBstRemove,
  traceInsert,
  traceRemove,
  traceRotateLeft,
  traceRotateRight,
} from "@shared/avl";

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

const stepKeysOf = (steps: { stepKey: string }[]) => steps.map((step) => step.stepKey);

describe("traceInsert", () => {
  it.each([
    ["left left", [30, 20], 10, "rebalance.case-left-left"],
    ["right right", [10, 20], 30, "rebalance.case-right-right"],
    ["left right", [30, 10], 20, "rebalance.case-left-right"],
    ["right left", [10, 30], 20, "rebalance.case-right-left"],
  ])("returns the same tree as insertKey and names the %s case", (_name, keys, key, caseKey) => {
    const root = build(keys);
    const traced = traceInsert(root, key);
    expect(traced.result).toEqual(insertKey(root, key));
    expect(stepKeysOf(traced.steps)).toContain(caseKey);
  });

  it("walks down, creates the node, then updates and checks each ancestor", () => {
    const traced = traceInsert(build([20, 10, 30]), 40);
    expect(stepKeysOf(traced.steps)).toEqual([
      "insert.check-empty",
      "insert.compare",
      "insert.check-bigger",
      "insert.go-right",
      "insert.check-empty",
      "insert.compare",
      "insert.check-bigger",
      "insert.go-right",
      "insert.check-empty",
      "insert.create-node",
      "insert.update-height",
      "update-height.compute-height",
      "update-height.compute-balance",
      "insert.rebalance",
      "rebalance.check",
      "rebalance.balanced",
      "insert.update-height",
      "update-height.compute-height",
      "update-height.compute-balance",
      "insert.rebalance",
      "rebalance.check",
      "rebalance.balanced",
    ]);
    expect(traced.steps[3]?.message).toBe("Insert 40 into the right subtree of 20.");
  });

  it("keeps the call stack on each step", () => {
    const traced = traceInsert(build([20, 10, 30]), 40);
    const stackOf = (index: number) =>
      traced.steps[index]?.callStack.map((frame) => `${frame.algorithm}(${frame.node})`);
    expect(stackOf(0)).toEqual(["insert(20)"]);
    expect(stackOf(8)).toEqual(["insert(20)", "insert(30)", "insert(null)"]);
    expect(stackOf(10)).toEqual(["insert(20)", "insert(30)"]);
    expect(stackOf(11)).toEqual(["insert(20)", "insert(30)", "update-height(30)"]);
    expect(stackOf(14)).toEqual(["insert(20)", "insert(30)", "rebalance(30)"]);
    expect(traced.steps[10]?.message).toBe("Back at 30. Update its height and balance factor.");
  });

  it.each([
    ["left right", [30, 10], 20, "rebalance.finish-left-right", "rotate-right.check-pivot"],
    ["right left", [10, 30], 20, "rebalance.finish-right-left", "rotate-left.check-pivot"],
  ])(
    "steps back into rebalance before the second rotation of the %s case",
    (_name, keys, key, finishKey, nextKey) => {
      const steps = traceInsert(build(keys), key).steps;
      const index = steps.findIndex((step) => step.stepKey === finishKey);
      expect(index).toBeGreaterThan(0);
      expect(steps[index]?.callStack.at(-1)?.algorithm).toBe("rebalance");
      expect(steps[index + 1]?.stepKey).toBe(nextKey);
      expect(steps[index + 1]?.callStack.at(-1)?.algorithm).toBe(
        nextKey.startsWith("rotate-right") ? "rotate-right" : "rotate-left",
      );
    },
  );

  it("shows the new node in the whole tree as soon as it is created", () => {
    const traced = traceInsert(build([20, 10, 30]), 40);
    const created = traced.steps.find((step) => step.stepKey === "insert.create-node");
    expect(toKeys(created?.tree ?? null)).toEqual([10, 20, 30, 40]);
    expect(created?.nodeStates[40]).toBe("new");
    expect(created?.nodeStates[20]).toBe("visited");
  });

  it("marks the unbalanced node before rotating", () => {
    const traced = traceInsert(build([10, 20]), 30);
    const caseStep = traced.steps.find((step) => step.stepKey === "rebalance.case-right-right");
    expect(caseStep?.nodeStates[10]).toBe("unbalanced");
    expect(stepKeysOf(traced.steps).slice(-9)).toEqual([
      "rebalance.check-side",
      "rebalance.check-right-child",
      "rebalance.case-right-right",
      "rotate-left.check-pivot",
      "rotate-left.pick-pivot",
      "rotate-left.move-inner-subtree",
      "rotate-left.lift-pivot",
      "rotate-left.update-heights",
      "rotate-left.done",
    ]);
    expect(traced.steps.at(-1)?.tree?.key).toBe(20);
  });

  it("reports a duplicate and leaves the tree alone", () => {
    const root = build([2, 1, 3]);
    const traced = traceInsert(root, 2);
    expect(toKeys(traced.result)).toEqual([1, 2, 3]);
    expect(stepKeysOf(traced.steps)).toEqual([
      "insert.check-empty",
      "insert.compare",
      "insert.check-bigger",
      "insert.duplicate",
    ]);
  });

  it("creates the root of an empty tree", () => {
    const traced = traceInsert(null, 5);
    expect(stepKeysOf(traced.steps)).toEqual(["insert.check-empty", "insert.create-node"]);
    expect(traced.steps[0]?.tree).toBeNull();
    expect(traced.steps[1]?.tree?.key).toBe(5);
  });
});

describe("traceRemove", () => {
  it("returns the same tree as removeKey through random removals", () => {
    let root = build([50, 25, 75, 10, 30, 60, 90, 5, 27, 35, 95]);
    for (const key of [25, 90, 50, 11, 5, 75, 60]) {
      const traced = traceRemove(root, key);
      expect(traced.result).toEqual(removeKey(root, key));
      root = traced.result;
    }
  });

  it("copies the in-order successor into a node with two children", () => {
    const traced = traceRemove(build([20, 10, 30, 25, 40]), 20);
    const steps = stepKeysOf(traced.steps);
    expect(steps.slice(0, 8)).toEqual([
      "delete.check-empty",
      "delete.compare",
      "delete.check-bigger",
      "delete.check-children",
      "delete.find-successor",
      "delete.copy-successor",
      "delete.remove-successor",
      "delete.check-empty",
    ]);
    expect(traced.steps[4]?.nodeStates[20]).toBe("deleting");
    expect(traced.steps[4]?.variables).toEqual({ key: 20, successor: 25 });
    expect(traced.steps[3]?.variables).toEqual({ key: 20, children: 2 });
  });

  it("replaces a leaf with nothing", () => {
    const traced = traceRemove(build([20, 10, 30]), 10);
    const replaced = traced.steps.find((step) => step.stepKey === "delete.replace-with-child");
    expect(replaced?.message).toBe("10 has no children, so it is simply removed.");
    expect(replaced?.nodeStates[10]).toBe("deleting");
  });

  it("reports a missing key", () => {
    const traced = traceRemove(build([20]), 5);
    expect(stepKeysOf(traced.steps)).toContain("delete.not-found");
    expect(toKeys(traced.result)).toEqual([20]);
  });
});

const avlOnlyStep =
  /^(update-height|rebalance|rotate-left|rotate-right)\.|\.(update-height|rebalance)$/;

const shapeOf = (node: AvlNode | null): string =>
  node ? `${node.key}(${shapeOf(node.left)},${shapeOf(node.right)})` : "#";

describe("plain BST traces", () => {
  it("inserts without any height, balance or rotation steps", () => {
    let root: AvlNode | null = null;
    for (const key of [1, 2, 3]) {
      const traced = traceBstInsert(root, key);
      expect(stepKeysOf(traced.steps).filter((step) => avlOnlyStep.test(step))).toEqual([]);
      root = traced.result;
    }
    expect(shapeOf(root)).toBe("1(#,2(#,3(#,#)))");
    expect(root?.height).toBe(3);
  });

  it("removes without rebalancing", () => {
    const root = buildTreeFromKeys([20, 10, 30, 40, 50], "bst");
    const traced = traceBstRemove(root, 10);
    expect(stepKeysOf(traced.steps).filter((step) => avlOnlyStep.test(step))).toEqual([]);
    expect(shapeOf(traced.result)).toBe("20(#,30(#,40(#,50(#,#))))");
  });

  it("builds a skewed tree in bst mode and a balanced one in avl mode", () => {
    expect(shapeOf(buildTreeFromKeys([1, 2, 3], "bst"))).toBe("1(#,2(#,3(#,#)))");
    expect(shapeOf(buildTreeFromKeys([1, 2, 3], "avl"))).toBe("2(1(#,#),3(#,#))");
    expect(shapeOf(buildTreeFromKeys([1, 2, 3]))).toBe("2(1(#,#),3(#,#))");
  });
});

describe("findNode and parentOf", () => {
  const root = build([20, 10, 30, 25]);

  it("finds a node by key, or null", () => {
    expect(findNode(root, 25)?.key).toBe(25);
    expect(findNode(root, 99)).toBeNull();
    expect(findNode(null, 1)).toBeNull();
  });

  it("finds the parent, or null for the root and missing keys", () => {
    expect(parentOf(root, 25)?.key).toBe(30);
    expect(parentOf(root, 20)).toBeNull();
    expect(parentOf(root, 99)).toBeNull();
  });
});

describe("pivotOf and canRotate", () => {
  const root = build([20, 10, 30]);

  it("takes the right child for a left rotation and the left child for a right one", () => {
    if (!root) throw new Error("Expected a tree");
    expect(pivotOf(root, "left")?.key).toBe(30);
    expect(pivotOf(root, "right")?.key).toBe(10);
  });

  it("can only rotate a node that is in the tree and has the pivot child", () => {
    expect(canRotate(root, 20, "left")).toBe(true);
    expect(canRotate(root, 10, "left")).toBe(false);
    expect(canRotate(root, 99, "right")).toBe(false);
  });
});

describe("openSpots", () => {
  it("gives the whole range for an empty tree", () => {
    expect(openSpots(null, 1, 99)).toEqual([{ parentKey: null, side: null, low: 1, high: 99 }]);
  });

  it("gives each empty child with the keys that fit there", () => {
    expect(openSpots(build([30, 20, 40]), 1, 99)).toEqual([
      { parentKey: 20, side: "left", low: 1, high: 19 },
      { parentKey: 20, side: "right", low: 21, high: 29 },
      { parentKey: 40, side: "left", low: 31, high: 39 },
      { parentKey: 40, side: "right", low: 41, high: 99 },
    ]);
  });

  it("skips a spot no key can fill", () => {
    expect(openSpots(build([2, 1]), 1, 99)).toEqual([
      { parentKey: 2, side: "right", low: 3, high: 99 },
    ]);
  });
});

describe("traceRotateLeft and traceRotateRight", () => {
  it("rotates the node with that key and fixes the heights above it", () => {
    const root = build([20, 10, 40, 30, 50]);
    const traced = traceRotateLeft(root, 40);
    expect(toKeys(traced.result)).toEqual(toKeys(root));
    expect(traced.result?.right?.key).toBe(50);
    expect(traced.result?.right?.left?.key).toBe(40);
    expect(traced.result?.height).toBe(4);
    expect(stepKeysOf(traced.steps)).toEqual([
      "rotate-left.check-pivot",
      "rotate-left.pick-pivot",
      "rotate-left.move-inner-subtree",
      "rotate-left.lift-pivot",
      "rotate-left.update-heights",
      "rotate-left.done",
    ]);
    expect(traced.steps.at(-1)?.tree?.right?.key).toBe(50);
  });

  it("matches rotateRight on the root", () => {
    const root = build([20, 10, 30, 5]);
    if (!root) throw new Error("Expected a tree");
    expect(traceRotateRight(root, 20).result).toEqual(rotateRight(root));
  });

  it("explains why a node with no pivot can't rotate", () => {
    const traced = traceRotateRight(build([10, 20]), 10);
    expect(stepKeysOf(traced.steps)).toEqual(["rotate-right.check-pivot", "rotate-right.no-pivot"]);
    expect(traced.result).toEqual(build([10, 20]));
  });

  it("does nothing for a key that isn't in the tree", () => {
    const root = build([10, 20]);
    expect(traceRotateLeft(root, 99)).toEqual({ result: root, steps: [] });
  });
});

describe("node states in traced steps", () => {
  const statesAfter = (steps: { stepKey: string }[], stepKey: string) =>
    steps.slice(steps.findIndex((step) => step.stepKey === stepKey) + 1);

  it("shows a new node as new only on the step that creates it", () => {
    const traced = traceInsert(build([20, 10, 30]), 40);
    const later = statesAfter(traced.steps, "insert.create-node") as typeof traced.steps;
    expect(later.length).toBeGreaterThan(0);
    for (const step of later) expect(Object.values(step.nodeStates)).not.toContain("new");
  });

  it("keeps the three rotation nodes marked through a whole left-right case", () => {
    const traced = traceInsert(build([50, 30, 70, 10]), 20);
    const first = traced.steps.findIndex((step) => step.stepKey === "rebalance.check-side");
    const last = traced.steps.findIndex((step) => step.stepKey === "rotate-right.done");
    expect(first).toBeGreaterThan(0);
    expect(traced.steps[first - 1]?.rotation).toBeNull();
    for (const step of traced.steps.slice(first, last + 1)) {
      expect(step.rotation).toEqual({ node: 30, label: "LR" });
      expect(step.nodeStates[30]).toBe("unbalanced");
      expect(step.nodeStates[10]).toBe("rotating");
      expect(step.nodeStates[20]).toBe("rotating");
    }
  });

  it("lets the rotation nodes go back to visited once the rotation ends", () => {
    const traced = traceInsert(build([50, 30, 70, 10]), 20);
    const last = traced.steps.findIndex((step) => step.stepKey === "rotate-right.done");
    const after = traced.steps.slice(last + 1);
    expect(after.length).toBeGreaterThan(0);
    for (const step of after) {
      expect(step.rotation).toBeNull();
      expect(Object.values(step.nodeStates)).not.toContain("unbalanced");
      expect(Object.values(step.nodeStates)).not.toContain("rotating");
    }
    expect(after[0]?.nodeStates[30]).toBe("visited");
  });

  it.each([
    [[10, 20], 30, "RR"],
    [[30, 20], 10, "LL"],
    [[10, 30], 20, "RL"],
  ] as const)("tags inserting into %j with %i as %s", (keys, key, label) => {
    const traced = traceInsert(build([...keys]), key);
    const tagged = traced.steps.find((step) => step.rotation !== null);
    expect(tagged?.rotation?.label).toBe(label);
  });

  it("tags a rotation by hand with its direction and marks the node and its pivot", () => {
    const traced = traceRotateLeft(build([20, 10, 30, 40]), 20);
    expect(traced.steps.length).toBeGreaterThan(0);
    for (const step of traced.steps) {
      expect(step.rotation).toEqual({ node: 20, label: "left" });
      expect(step.nodeStates[20]).toBe("rotating");
      expect(step.nodeStates[30]).toBe("rotating");
    }
  });

  it("clears the deleting mark once the node is gone, even when its successor shares the key", () => {
    const traced = traceRemove(build([20, 10, 30, 25, 40]), 20);
    const replaced = traced.steps.findIndex((step) => step.stepKey === "delete.replace-with-child");
    expect(traced.steps[replaced]?.nodeStates[25]).toBe("deleting");
    for (const step of traced.steps.slice(replaced + 1)) {
      expect(Object.values(step.nodeStates)).not.toContain("deleting");
    }
  });

  it("only gives states to keys that are in that step's tree", () => {
    let seed = 3;
    const random = () => {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      return seed / 2147483648;
    };
    let root: AvlNode | null = null;
    for (let round = 0; round < 200; round += 1) {
      const key = Math.floor(random() * 30);
      const traced: SteppedResult<AvlNode | null> =
        random() < 0.6 ? traceInsert(root, key) : traceRemove(root, key);
      for (const step of traced.steps) {
        const keys = new Set(toKeys(step.tree));
        for (const stateKey of Object.keys(step.nodeStates)) {
          expect(keys.has(Number(stateKey))).toBe(true);
        }
      }
      root = traced.result;
    }
  });
});
