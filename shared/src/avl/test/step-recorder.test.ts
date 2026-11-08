import { describe, expect, it } from "vitest";

import { type AvlNode, insertKey, StepRecorder } from "@shared/avl";

const build = (keys: number[]) =>
  keys.reduce<AvlNode | null>((root, key) => insertKey(root, key), null);

describe("StepRecorder", () => {
  it("snapshots the tree, node states, message and variables on each emit", () => {
    const root = build([20, 10, 30]);
    const recorder = new StepRecorder(root);
    recorder.focus(20);
    recorder.emit("search.compare", { key: 10, node: 20 });
    expect(recorder.steps).toEqual([
      {
        stepKey: "search.compare",
        tree: root,
        nodeStates: { 20: "active" },
        message: "Compare 10 with 20.",
        variables: { key: 10, node: 20 },
      },
    ]);
  });

  it("turns the active node into a visited one when the focus moves", () => {
    const recorder = new StepRecorder(build([20, 10]));
    recorder.focus(20);
    recorder.focus(10);
    recorder.emit("search.found", { key: 10, node: 10 });
    expect(recorder.steps[0]?.nodeStates).toEqual({ 20: "visited", 10: "active" });
  });

  it("shows a new node as new for one step, then as visited", () => {
    const recorder = new StepRecorder(build([20, 10]));
    recorder.focus(10);
    recorder.mark(10, "new");
    recorder.emit("insert.create-node", { key: 10 });
    recorder.focus(20);
    recorder.emit("insert.compare", { key: 10, node: 20 });
    expect(recorder.steps[0]?.nodeStates).toEqual({ 10: "new" });
    expect(recorder.steps[1]?.nodeStates).toEqual({ 10: "visited", 20: "active" });
  });

  it("keeps an unbalanced mark when the focus moves to another node", () => {
    const recorder = new StepRecorder(build([20, 10]));
    recorder.focus(20);
    recorder.mark(20, "unbalanced");
    recorder.focus(10);
    recorder.emit("rebalance.check", { node: 10, balance: 0 });
    expect(recorder.steps[0]?.nodeStates).toEqual({ 20: "unbalanced", 10: "active" });
  });

  it("forgets a state when it is cleared", () => {
    const recorder = new StepRecorder(build([20, 10]));
    recorder.focus(10);
    recorder.mark(10, "deleting");
    recorder.clear(10);
    recorder.emit("delete.not-found", { key: 10 });
    expect(recorder.steps[0]?.nodeStates).toEqual({});
  });

  it("drops the states of keys that leave the tree", () => {
    const recorder = new StepRecorder(build([20, 10, 30]));
    recorder.focus(20);
    recorder.focus(10);
    recorder.enter("left");
    recorder.replace(null);
    recorder.leave();
    recorder.emit("delete.not-found", { key: 10 });
    expect(recorder.steps[0]?.nodeStates).toEqual({ 20: "visited" });
  });

  it("shares one frozen state object between steps where nothing changed", () => {
    const recorder = new StepRecorder(build([20, 10]));
    recorder.focus(20);
    recorder.emit("insert.compare", { key: 5, node: 20 });
    recorder.emit("insert.go-left", { key: 5, node: 20 });
    recorder.focus(10);
    recorder.emit("insert.compare", { key: 5, node: 10 });
    const [first, second, third] = recorder.steps;
    expect(second?.nodeStates).toBe(first?.nodeStates);
    expect(third?.nodeStates).not.toBe(second?.nodeStates);
    expect(Object.isFrozen(first?.nodeStates)).toBe(true);
  });

  it("splices a replaced subtree into the whole tree at the current path", () => {
    const recorder = new StepRecorder(build([20, 10, 30]));
    recorder.enter("left");
    recorder.replace({ key: 5, height: 1, left: null, right: null });
    recorder.leave();
    recorder.emit("insert.create-node", { key: 5 });
    const tree = recorder.steps[0]?.tree;
    expect(tree?.key).toBe(20);
    expect(tree?.left?.key).toBe(5);
    expect(tree?.right?.key).toBe(30);
  });

  it("keeps earlier snapshots unchanged", () => {
    const recorder = new StepRecorder(build([20, 10]));
    recorder.emit("insert.compare", { key: 5, node: 20 });
    recorder.enter("left");
    recorder.replace(null);
    recorder.emit("insert.compare", { key: 5, node: 20 });
    expect(recorder.steps[0]?.tree?.left?.key).toBe(10);
    expect(recorder.steps[1]?.tree?.left).toBeNull();
  });

  it("returns the result with the steps", () => {
    const recorder = new StepRecorder(null);
    recorder.emit("levelorder.done", { visited: 0 });
    expect(recorder.finish([1, 2])).toEqual({ result: [1, 2], steps: recorder.steps });
  });
});
