import { describe, expect, it } from "vitest";

import { encodeTree, insertKey } from "@shared/avl";
import { decodeQuestionTree, replaySteps } from "@/lib/test/replay-steps";

const tree = [20, 10, 30].reduce<ReturnType<typeof insertKey> | null>(
  (current, key) => insertKey(current, key),
  null,
);

describe("decodeQuestionTree", () => {
  it("decodes an encoded tree", () => {
    expect(encodeTree(decodeQuestionTree(encodeTree(tree)))).toBe(encodeTree(tree));
  });

  it("gives null for no tree or a broken one", () => {
    expect(decodeQuestionTree(null)).toBeNull();
    expect(decodeQuestionTree("not a tree")).toBeNull();
  });
});

describe("replaySteps", () => {
  it("traces an insert", () => {
    const steps = replaySteps(tree, { kind: "operation", operation: "insert", key: 5 });
    expect(steps.length).toBeGreaterThan(0);
    expect(steps.at(-1)?.tree).not.toBeNull();
  });

  it("traces a delete", () => {
    const steps = replaySteps(tree, { kind: "operation", operation: "delete", key: 10 });
    expect(steps.length).toBeGreaterThan(0);
  });

  it("traces a traversal and gives nothing for an empty tree", () => {
    expect(replaySteps(tree, { kind: "traversal", order: "inorder" }).length).toBeGreaterThan(0);
    expect(replaySteps(null, { kind: "traversal", order: "inorder" })).toEqual([]);
  });
});
