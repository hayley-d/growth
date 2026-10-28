export type AvlNode = {
  key: number;
  height: number;
  left: AvlNode | null;
  right: AvlNode | null;
};

export type AvlNodePosition = {
  key: number;
  x: number;
  y: number;
  parentKey: number | null;
};

const heightOf = (node: AvlNode | null) => node?.height ?? 0;

const withChildren = (node: AvlNode, left: AvlNode | null, right: AvlNode | null): AvlNode => ({
  key: node.key,
  left,
  right,
  height: 1 + Math.max(heightOf(left), heightOf(right)),
});

const balanceOf = (node: AvlNode) => heightOf(node.left) - heightOf(node.right);

export const rotateRight = (node: AvlNode): AvlNode => {
  const pivot = node.left;
  if (!pivot) return node;
  return withChildren(pivot, pivot.left, withChildren(node, pivot.right, node.right));
};

export const rotateLeft = (node: AvlNode): AvlNode => {
  const pivot = node.right;
  if (!pivot) return node;
  return withChildren(pivot, withChildren(node, node.left, pivot.left), pivot.right);
};

export const rebalance = (node: AvlNode): AvlNode => {
  const balance = balanceOf(node);
  if (balance > 1 && node.left) {
    const left = balanceOf(node.left) < 0 ? rotateLeft(node.left) : node.left;
    return rotateRight(withChildren(node, left, node.right));
  }
  if (balance < -1 && node.right) {
    const right = balanceOf(node.right) > 0 ? rotateRight(node.right) : node.right;
    return rotateLeft(withChildren(node, node.left, right));
  }
  return node;
};

export const insertKey = (node: AvlNode | null, key: number): AvlNode => {
  if (!node) return { key, height: 1, left: null, right: null };
  if (key < node.key) return rebalance(withChildren(node, insertKey(node.left, key), node.right));
  if (key > node.key) return rebalance(withChildren(node, node.left, insertKey(node.right, key)));
  return node;
};

const smallestKey = (node: AvlNode): number => (node.left ? smallestKey(node.left) : node.key);

export const removeKey = (node: AvlNode | null, key: number): AvlNode | null => {
  if (!node) return null;
  if (key < node.key) return rebalance(withChildren(node, removeKey(node.left, key), node.right));
  if (key > node.key) return rebalance(withChildren(node, node.left, removeKey(node.right, key)));
  if (!node.left || !node.right) return node.left ?? node.right;
  const successorKey = smallestKey(node.right);
  return rebalance(
    withChildren({ ...node, key: successorKey }, node.left, removeKey(node.right, successorKey)),
  );
};

export const toKeys = (node: AvlNode | null): number[] =>
  node ? [...toKeys(node.left), node.key, ...toKeys(node.right)] : [];

export const layoutTree = (root: AvlNode | null): AvlNodePosition[] => {
  const positions: AvlNodePosition[] = [];
  const visit = (node: AvlNode | null, depth: number, parentKey: number | null) => {
    if (!node) return;
    visit(node.left, depth + 1, node.key);
    positions.push({ key: node.key, x: positions.length, y: depth, parentKey });
    visit(node.right, depth + 1, node.key);
  };
  visit(root, 0, null);
  return positions;
};
