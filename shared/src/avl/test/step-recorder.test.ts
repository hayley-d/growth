import { describe, expect, it } from "vitest";

import { type AvlNode, insertKey, StepRecorder, withinCall, withinRotation } from "@shared/avl";

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
        callStack: [],
        rotation: null,
        message: "Is 10 equal to 20? No.",
        variables: { key: 10, node: 20 },
      },
    ]);
  });

  it("records the calls that are open when a step is emitted", () => {
    const recorder = new StepRecorder(build([20, 10]));
    withinCall(recorder, "insert", 20, () => {
      recorder.emit("insert.compare", { key: 5, node: 20 });
      withinCall(recorder, "insert", 10, () => {
        recorder.emit("insert.compare", { key: 5, node: 10 });
      });
      recorder.emit("insert.update-height", { node: 20 });
    });
    expect(recorder.steps.map((step) => step.callStack)).toEqual([
      [{ algorithm: "insert", node: 20 }],
      [
        { algorithm: "insert", node: 20 },
        { algorithm: "insert", node: 10 },
      ],
      [{ algorithm: "insert", node: 20 }],
    ]);
  });

  it("shares one frozen call stack between steps where no call changed", () => {
    const recorder = new StepRecorder(build([20]));
    withinCall(recorder, "search", 20, () => {
      recorder.emit("search.compare", { key: 20, node: 20 });
      recorder.emit("search.found", { key: 20, node: 20 });
    });
    const [first, second] = recorder.steps;
    expect(first?.callStack).toBe(second?.callStack);
    expect(Object.isFrozen(first?.callStack)).toBe(true);
  });

  it("closes the call around withinCall and returns its result", () => {
    const recorder = new StepRecorder(build([20]));
    const result = withinCall(recorder, "search", 20, () => {
      recorder.emit("search.compare", { key: 20, node: 20 });
      return "done";
    });
    recorder.emit("search.found", { key: 20, node: 20 });
    expect(result).toBe("done");
    expect(recorder.steps.map((step) => step.callStack.length)).toEqual([1, 0]);
    expect(withinCall(undefined, "search", 20, () => 7)).toBe(7);
  });

  it("closes the call when the work inside withinCall throws", () => {
    const recorder = new StepRecorder(build([20, 10]));
    withinCall(recorder, "insert", 20, () => {
      expect(() =>
        withinCall(recorder, "insert", 10, () => {
          throw new Error("stop");
        }),
      ).toThrow("stop");
      recorder.emit("insert.update-height", { node: 20 });
    });
    expect(recorder.steps[0]?.callStack).toEqual([{ algorithm: "insert", node: 20 }]);
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
    recorder.emit("levelorder.check-queue", { queued: 0, visited: 0 });
    expect(recorder.finish([1, 2])).toEqual({ result: [1, 2], steps: recorder.steps });
  });

  it("keeps rotation roles through focus and lets them go when the rotation ends", () => {
    const recorder = new StepRecorder(build([20, 10, 30]));
    withinRotation(
      recorder,
      { node: 20, label: "left" },
      { 20: "unbalanced", 30: "rotating" },
      () => {
        recorder.focus(20);
        recorder.focus(30);
        recorder.emit("rotate-left.lift-pivot", { node: 20, pivot: 30 });
      },
    );
    recorder.emit("insert.update-height", { node: 20 });
    expect(recorder.steps[0]?.nodeStates).toEqual({ 20: "unbalanced", 30: "rotating" });
    expect(recorder.steps[0]?.rotation).toEqual({ node: 20, label: "left" });
    expect(recorder.steps[1]?.nodeStates).toEqual({ 20: "visited", 30: "visited" });
    expect(recorder.steps[1]?.rotation).toBeNull();
  });

  it("keeps the outer rotation when one opens inside it", () => {
    const recorder = new StepRecorder(build([20, 10, 30]));
    withinRotation(
      recorder,
      { node: 20, label: "LR" },
      { 20: "unbalanced", 10: "rotating" },
      () => {
        withinRotation(
          recorder,
          { node: 10, label: "left" },
          { 10: "unbalanced", 30: "rotating" },
          () => recorder.emit("rotate-left.lift-pivot", { node: 10, pivot: 30 }),
        );
        recorder.emit("rebalance.finish-left-right", { node: 20 });
      },
    );
    expect(recorder.steps[0]?.nodeStates).toEqual({
      20: "unbalanced",
      10: "rotating",
      30: "rotating",
    });
    expect(recorder.steps[0]?.rotation).toEqual({ node: 10, label: "left" });
    expect(recorder.steps[1]?.nodeStates).toEqual({
      20: "unbalanced",
      10: "rotating",
      30: "visited",
    });
    expect(recorder.steps[1]?.rotation).toEqual({ node: 20, label: "LR" });
  });

  it("ends the rotation even when the work throws", () => {
    const recorder = new StepRecorder(build([20, 30]));
    expect(() =>
      withinRotation(recorder, { node: 20, label: "left" }, { 20: "rotating" }, () => {
        throw new Error("stop");
      }),
    ).toThrow("stop");
    recorder.emit("insert.update-height", { node: 20 });
    expect(recorder.steps[0]?.rotation).toBeNull();
    expect(recorder.steps[0]?.nodeStates).toEqual({ 20: "visited" });
  });
});
