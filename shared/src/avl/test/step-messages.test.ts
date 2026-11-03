import { describe, expect, it } from "vitest";

import { describeStep, stepKeysByAlgorithm, stepMessages } from "@shared/avl";

describe("stepMessages", () => {
  it("has a message for every step key in the catalogue and nothing else", () => {
    expect(Object.keys(stepMessages).sort()).toEqual(
      Object.values(stepKeysByAlgorithm).flat().sort(),
    );
  });

  it.each([
    ["insert.go-right", { key: 40, node: 20 }, "Insert 40 into the right subtree of 20."],
    ["delete.go-left", { key: 15, node: 20 }, "Delete 15 from the left subtree of 20."],
    ["search.go-left", { key: 15, node: 20 }, "Move to the left child of 20."],
    [
      "update-height.compute-balance",
      { node: 30, balance: -2, leftHeight: 0, rightHeight: 2 },
      "The balance factor of 30 is -2: left height 0 minus right height 2.",
    ],
    [
      "rebalance.case-left-right",
      { node: 30, balance: 2, child: 10, childBalance: -1 },
      "This is the left-right case: rotate 10 left first, then 30 right.",
    ],
    ["inorder.visit", { node: 5, visited: 1 }, "Visit 5."],
  ] as const)("describes %s as a plain sentence", (stepKey, variables, message) => {
    expect(describeStep(stepKey, variables)).toBe(message);
  });

  it("answers each check on the line that asks it", () => {
    expect(describeStep("insert.check-empty", { key: 5, node: null })).toBe("This spot is empty.");
    expect(describeStep("insert.check-empty", { key: 5, node: 30 })).toBe(
      "30 is here, so this spot isn't empty.",
    );
    expect(describeStep("insert.compare", { key: 5, node: 30 })).toBe("Is 5 smaller than 30? Yes.");
    expect(describeStep("insert.check-bigger", { key: 30, node: 30 })).toBe(
      "Is 30 bigger than 30? No, they are the same.",
    );
    expect(describeStep("rebalance.check", { node: 20, balance: 2 })).toBe(
      "Is the balance factor of 20 between -1 and 1? No, it is 2.",
    );
    expect(describeStep("rebalance.check-side", { node: 20, balance: -2 })).toBe(
      "Is 20 left heavy? No, its balance factor is -2, so it is right heavy.",
    );
    expect(describeStep("rotate-right.check-pivot", { node: 20, pivot: null })).toBe(
      "Does 20 have a left child? No.",
    );
    expect(describeStep("delete.check-children", { key: 20, children: 1 })).toBe(
      "Found 20. Does it have at most one child? Yes, it has one.",
    );
  });

  it("counts what is left in the level-order queue", () => {
    expect(describeStep("levelorder.check-queue", { queued: 1, visited: 0 })).toBe(
      "Is the queue empty? No, it holds 1 node.",
    );
    expect(describeStep("levelorder.check-queue", { queued: 3, visited: 1 })).toBe(
      "Is the queue empty? No, it holds 3 nodes.",
    );
    expect(describeStep("levelorder.check-queue", { queued: 0, visited: 0 })).toBe(
      "Is the queue empty? Yes, so there's nothing to visit.",
    );
  });

  it("picks the wording for a removed node from whether it has a child", () => {
    expect(describeStep("delete.replace-with-child", { key: 10, child: null })).toBe(
      "10 has no children, so it is simply removed.",
    );
    expect(describeStep("delete.replace-with-child", { key: 30, child: 40 })).toBe(
      "30 has one child, so 40 takes its place.",
    );
  });
});
