import { expect, it } from "vitest";

import type { ExpressionNode } from "@shared/schemas";
import { expressionTreeSteps, notationName } from "@/lib/expression-tree-steps";

const expression: ExpressionNode = {
  operator: "+",
  left: { operator: "×", left: { value: 2 }, right: { value: 3 } },
  right: { value: 4 },
};

const labelsInOrder = (order: "preorder" | "inorder" | "postorder") => {
  const { steps, labels } = expressionTreeSteps(expression, order);
  return steps.slice(1).map((step) => labels[step.currentKey ?? -1]);
};

it("keeps the shape of the expression, with each node labelled", () => {
  const { root, labels } = expressionTreeSteps(expression, "preorder");

  expect(root && labels[root.key]).toBe("+");
  expect(root?.left && labels[root.left.key]).toBe("×");
  expect(root?.right && labels[root.right.key]).toBe("4");
  expect(root?.left?.left && labels[root.left.left.key]).toBe("2");
  expect(root?.left?.right && labels[root.left.right.key]).toBe("3");
  expect(root?.height).toBe(3);
});

it("starts with nothing visited, then visits one node per step", () => {
  const { steps, labels } = expressionTreeSteps(expression, "preorder");

  expect(steps).toHaveLength(6);
  expect(steps[0]).toEqual({ visitedKeys: [], currentKey: null });
  expect(steps[2]?.visitedKeys.map((key) => labels[key])).toEqual(["+", "×"]);
});

it("visits the nodes in the block's order", () => {
  expect(labelsInOrder("preorder")).toEqual(["+", "×", "2", "3", "4"]);
  expect(labelsInOrder("inorder")).toEqual(["2", "×", "3", "+", "4"]);
  expect(labelsInOrder("postorder")).toEqual(["2", "3", "×", "4", "+"]);
});

it("names the notation each order writes", () => {
  expect(notationName("preorder")).toBe("prefix");
  expect(notationName("inorder")).toBe("infix");
  expect(notationName("postorder")).toBe("postfix");
});

it("draws a single value as one node", () => {
  const { root, steps, labels } = expressionTreeSteps({ value: 7 }, "preorder");

  expect(root && labels[root.key]).toBe("7");
  expect(steps).toHaveLength(2);
});
