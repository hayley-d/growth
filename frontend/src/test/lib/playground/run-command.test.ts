import { describe, expect, it } from "vitest";

import { type AvlNode, checkGoal, insertKey, toKeys } from "@shared/avl";
import { type CommandContext, runCommand, unbalancedKeys } from "@/lib/playground/run-command";
import { maxPlaygroundKeys } from "@/lib/playground/setup";

const build = (keys: number[]) =>
  keys.reduce<AvlNode | null>((tree, key) => insertKey(tree, key), null);

const context = (keys: number[], changes: Partial<CommandContext> = {}): CommandContext => ({
  tree: build(keys),
  autoBalance: true,
  setup: { topic: "avl", traversal: "inorder", explore: "interact" },
  seed: 1,
  ...changes,
});

describe("runCommand", () => {
  it("traces an insert that rotates", () => {
    const outcome = runCommand(context([30, 20]), { kind: "insert", keys: [10] });
    expect(outcome.ok).toBe(true);
    expect(outcome.tree?.key).toBe(20);
    expect(outcome.run?.steps.some((step) => step.stepKey.startsWith("rotate-right"))).toBe(true);
  });

  it("refuses a duplicate and a full tree", () => {
    expect(runCommand(context([30]), { kind: "insert", keys: [30] }).message).toMatch(
      /already in the tree/,
    );
    const full = context(Array.from({ length: maxPlaygroundKeys }, (_, index) => index + 1));
    expect(runCommand(full, { kind: "insert", keys: [99] }).ok).toBe(false);
  });

  it("inserts with no rotations when auto-balance is off", () => {
    const outcome = runCommand(context([10, 20], { autoBalance: false }), {
      kind: "insert",
      keys: [30],
    });
    expect(outcome.run).toBeNull();
    expect(outcome.tone).toBe("warn");
    expect(unbalancedKeys(outcome.tree)).toEqual([10]);
  });

  it("needs auto-balance off to rotate, and says when the tree is fixed", () => {
    expect(runCommand(context([10, 20]), { kind: "rotate", direction: "left", key: 10 }).ok).toBe(
      false,
    );
    const lopsided = runCommand(context([10, 20], { autoBalance: false }), {
      kind: "insert",
      keys: [30],
    });
    const fixed = runCommand(
      { ...context([]), tree: lopsided.tree, autoBalance: false },
      { kind: "rotate", direction: "left", key: 10 },
    );
    expect(fixed.ok).toBe(true);
    expect(checkGoal(fixed.tree, { kind: "validAvl" })).toBe(true);
    expect(fixed.message).toMatch(/AVL tree again/);
  });

  it("refuses a rotation with no pivot", () => {
    const outcome = runCommand(context([10, 20], { autoBalance: false }), {
      kind: "rotate",
      direction: "right",
      key: 10,
    });
    expect(outcome.message).toBe("10 has no left child, so it can't rotate right.");
  });

  it("rebuilds the tree when auto-balance comes back on", () => {
    const lopsided = runCommand(context([10, 20], { autoBalance: false }), {
      kind: "insert",
      keys: [30],
    });
    const outcome = runCommand(
      { ...context([]), tree: lopsided.tree, autoBalance: false },
      { kind: "balance", on: true },
    );
    expect(checkGoal(outcome.tree, { kind: "validAvl" })).toBe(true);
  });

  it("walks the tree and builds unbalanced trees for traversals", () => {
    const setup = { topic: "traversal", traversal: "preorder", explore: "watch" } as const;
    const built = runCommand(context([], { setup }), { kind: "tree", keys: [10, 20, 30] });
    expect(unbalancedKeys(built.tree)).toEqual([10]);
    const walked = runCommand(
      { ...context([], { setup }), tree: built.tree },
      { kind: "walk", order: "preorder" },
    );
    expect(walked.run?.walk).toEqual([10, 20, 30]);
    expect(runCommand(context([], { setup }), { kind: "walk", order: "preorder" }).ok).toBe(false);
  });

  it("makes a random tree, clears, and leaves search without a change", () => {
    expect(toKeys(runCommand(context([]), { kind: "random", size: 4 }).tree)).toHaveLength(4);
    expect(runCommand(context([5]), { kind: "clear" }).tree).toBeNull();
    const searched = runCommand(context([5, 3]), { kind: "search", key: 3 });
    expect(searched.tree).toEqual(build([5, 3]));
    expect(searched.run?.label).toBe("Search for 3");
  });
});
