import { describe, expect, it } from "vitest";

import { describeStep, stepKeysByAlgorithm, stepMessages } from "@shared/avl";

describe("stepMessages", () => {
  it("has a message for every step key in the catalogue and nothing else", () => {
    expect(Object.keys(stepMessages).sort()).toEqual(
      Object.values(stepKeysByAlgorithm).flat().sort(),
    );
  });

  it.each([
    ["insert.go-right", { key: 40, node: 20 }, "40 is bigger than 20, so go right."],
    ["search.go-left", { key: 15, node: 20 }, "15 is smaller than 20, so go left."],
    [
      "update-height.compute-balance",
      { node: 30, balance: -2, leftHeight: 0, rightHeight: 2 },
      "The balance factor of 30 is -2: left height 0 minus right height 2.",
    ],
    [
      "rebalance.case-left-right",
      { node: 30, balance: 2, child: 10, childBalance: -1 },
      "30 is left heavy and its left child 10 leans right. This is the left-right case: rotate 10 left, then 30 right.",
    ],
    ["inorder.visit", { node: 5, visited: 1 }, "Visit 5."],
  ] as const)("describes %s as a plain sentence", (stepKey, variables, message) => {
    expect(describeStep(stepKey, variables)).toBe(message);
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
