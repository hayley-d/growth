import { type AvlNode, toKeys } from "@shared/avl/src/avl-tree";
import { type TraversalOrder, TreeTraversal } from "@shared/avl/src/tree-traversal";

export type TreeGoal =
  | { kind: "containsKeys"; keys: number[] }
  | { kind: "validAvl" }
  | { kind: "traversal"; order: TraversalOrder; keys: number[] };

const isSortedAscending = (keys: number[]) =>
  keys.every((key, index) => {
    const previous = keys[index - 1];
    return previous === undefined || previous < key;
  });

const checkHeightsAndBalance = (node: AvlNode | null): { height: number; valid: boolean } => {
  if (!node) return { height: 0, valid: true };
  const left = checkHeightsAndBalance(node.left);
  const right = checkHeightsAndBalance(node.right);
  if (!left.valid || !right.valid) return { height: 0, valid: false };
  const expectedHeight = 1 + Math.max(left.height, right.height);
  const balanced = Math.abs(left.height - right.height) <= 1;
  return { height: expectedHeight, valid: balanced && node.height === expectedHeight };
};

const isValidAvl = (root: AvlNode | null): boolean =>
  isSortedAscending(toKeys(root)) && checkHeightsAndBalance(root).valid;

export const checkGoal = (root: AvlNode | null, goal: TreeGoal): boolean => {
  if (goal.kind === "containsKeys") {
    const keys = new Set(toKeys(root));
    return goal.keys.every((key) => keys.has(key));
  }
  if (goal.kind === "traversal") {
    const keys = [...new TreeTraversal(root, goal.order)].map((node) => node.key);
    return keys.length === goal.keys.length && keys.every((key, index) => key === goal.keys[index]);
  }
  return isValidAvl(root);
};
