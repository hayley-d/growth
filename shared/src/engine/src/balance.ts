import type { AvlNode } from "@shared/avl/src/avl-tree";

const heightOf = (node: AvlNode | null) => node?.height ?? 0;

const balanceOf = (node: AvlNode) => heightOf(node.left) - heightOf(node.right);

export const findUnbalanced = (node: AvlNode | null): AvlNode[] => {
  if (!node) return [];
  return [
    ...findUnbalanced(node.left),
    ...(Math.abs(balanceOf(node)) > 1 ? [node] : []),
    ...findUnbalanced(node.right),
  ];
};

const withinBounds = (node: AvlNode | null, min: number | null, max: number | null): boolean => {
  if (!node) return true;
  if (min !== null && node.key <= min) return false;
  if (max !== null && node.key >= max) return false;
  const leftHeight = heightOf(node.left);
  const rightHeight = heightOf(node.right);
  if (node.height !== 1 + Math.max(leftHeight, rightHeight)) return false;
  if (Math.abs(leftHeight - rightHeight) > 1) return false;
  return withinBounds(node.left, min, node.key) && withinBounds(node.right, node.key, max);
};

export const isAvl = (node: AvlNode | null): boolean => withinBounds(node, null, null);
