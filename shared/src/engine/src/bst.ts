import type { AvlNode } from "@shared/avl/src/avl-tree";

const heightOf = (node: AvlNode | null) => node?.height ?? 0;

const withChildren = (node: AvlNode, left: AvlNode | null, right: AvlNode | null): AvlNode => ({
  key: node.key,
  left,
  right,
  height: 1 + Math.max(heightOf(left), heightOf(right)),
});

const smallestKey = (node: AvlNode): number => (node.left ? smallestKey(node.left) : node.key);

export const insertBst = (node: AvlNode | null, key: number): AvlNode => {
  if (!node) return { key, height: 1, left: null, right: null };
  if (key < node.key) return withChildren(node, insertBst(node.left, key), node.right);
  if (key > node.key) return withChildren(node, node.left, insertBst(node.right, key));
  return node;
};

export const removeBst = (node: AvlNode | null, key: number): AvlNode | null => {
  if (!node) return null;
  if (key < node.key) return withChildren(node, removeBst(node.left, key), node.right);
  if (key > node.key) return withChildren(node, node.left, removeBst(node.right, key));
  if (!node.left || !node.right) return node.left ?? node.right;
  const successorKey = smallestKey(node.right);
  return withChildren(
    { ...node, key: successorKey },
    node.left,
    removeBst(node.right, successorKey),
  );
};
