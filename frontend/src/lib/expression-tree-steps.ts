import { type AvlNode, TreeTraversal } from "@shared/avl";
import type { ExpressionNode } from "@shared/schemas";

export type ExpressionOrder = "preorder" | "inorder" | "postorder";

export type ExpressionTreeStep = {
  visitedKeys: number[];
  currentKey: number | null;
};

const notationNames: Record<ExpressionOrder, string> = {
  preorder: "prefix",
  inorder: "infix",
  postorder: "postfix",
};

export const notationName = (order: ExpressionOrder) => notationNames[order];

const toTree = (expression: ExpressionNode, labels: Record<number, string>): AvlNode => {
  if ("value" in expression) {
    const key = Object.keys(labels).length;
    labels[key] = String(expression.value);
    return { key, height: 1, left: null, right: null };
  }
  const left = toTree(expression.left, labels);
  const key = Object.keys(labels).length;
  labels[key] = expression.operator;
  const right = toTree(expression.right, labels);
  return { key, height: Math.max(left.height, right.height) + 1, left, right };
};

export const expressionTreeSteps = (expression: ExpressionNode, order: ExpressionOrder) => {
  const labels: Record<number, string> = {};
  const root = toTree(expression, labels);
  const visits = [...new TreeTraversal(root, order)].map((node) => node.key);
  const steps: ExpressionTreeStep[] = [
    { visitedKeys: [], currentKey: null },
    ...visits.map((key, index) => ({ visitedKeys: visits.slice(0, index + 1), currentKey: key })),
  ];
  return { root, labels, steps };
};
