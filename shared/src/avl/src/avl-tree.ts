import { type SteppedResult, StepRecorder } from "@shared/avl/src/step-recorder";

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

const updateNode = (
  node: AvlNode,
  left: AvlNode | null,
  right: AvlNode | null,
  recorder?: StepRecorder,
): AvlNode => {
  const updated = withChildren(node, left, right);
  recorder?.replace(updated);
  recorder?.focus(updated.key);
  recorder?.emit("update-height.compute-height", { node: updated.key, height: updated.height });
  recorder?.emit("update-height.compute-balance", {
    node: updated.key,
    balance: balanceOf(updated),
    leftHeight: heightOf(left),
    rightHeight: heightOf(right),
  });
  return updated;
};

const rotateRightAt = (node: AvlNode, recorder?: StepRecorder): AvlNode => {
  const pivot = node.left;
  recorder?.focus(node.key);
  if (!pivot) {
    recorder?.emit("rotate-right.no-pivot", { node: node.key, pivot: null });
    return node;
  }
  recorder?.emit("rotate-right.pick-pivot", { node: node.key, pivot: pivot.key });
  recorder?.emit("rotate-right.move-inner-subtree", {
    node: node.key,
    pivot: pivot.key,
    innerSubtree: pivot.right?.key ?? null,
  });
  const rotated = withChildren(pivot, pivot.left, withChildren(node, pivot.right, node.right));
  recorder?.replace(rotated);
  recorder?.focus(pivot.key);
  recorder?.emit("rotate-right.lift-pivot", { node: node.key, pivot: pivot.key });
  recorder?.emit("rotate-right.update-heights", { node: node.key, pivot: pivot.key });
  return rotated;
};

const rotateLeftAt = (node: AvlNode, recorder?: StepRecorder): AvlNode => {
  const pivot = node.right;
  recorder?.focus(node.key);
  if (!pivot) {
    recorder?.emit("rotate-left.no-pivot", { node: node.key, pivot: null });
    return node;
  }
  recorder?.emit("rotate-left.pick-pivot", { node: node.key, pivot: pivot.key });
  recorder?.emit("rotate-left.move-inner-subtree", {
    node: node.key,
    pivot: pivot.key,
    innerSubtree: pivot.left?.key ?? null,
  });
  const rotated = withChildren(pivot, withChildren(node, node.left, pivot.left), pivot.right);
  recorder?.replace(rotated);
  recorder?.focus(pivot.key);
  recorder?.emit("rotate-left.lift-pivot", { node: node.key, pivot: pivot.key });
  recorder?.emit("rotate-left.update-heights", { node: node.key, pivot: pivot.key });
  return rotated;
};

const rebalanceAt = (node: AvlNode, recorder?: StepRecorder): AvlNode => {
  const balance = balanceOf(node);
  recorder?.focus(node.key);
  recorder?.emit("rebalance.check", { node: node.key, balance });
  if (balance > 1 && node.left) {
    recorder?.mark(node.key, "unbalanced");
    let left = node.left;
    const caseVariables = {
      node: node.key,
      balance,
      child: left.key,
      childBalance: balanceOf(left),
    };
    if (balanceOf(left) < 0) {
      recorder?.emit("rebalance.case-left-right", caseVariables);
      recorder?.enter("left");
      left = rotateLeftAt(left, recorder);
      recorder?.leave();
    } else {
      recorder?.emit("rebalance.case-left-left", caseVariables);
    }
    return rotateRightAt(withChildren(node, left, node.right), recorder);
  }
  if (balance < -1 && node.right) {
    recorder?.mark(node.key, "unbalanced");
    let right = node.right;
    const caseVariables = {
      node: node.key,
      balance,
      child: right.key,
      childBalance: balanceOf(right),
    };
    if (balanceOf(right) > 0) {
      recorder?.emit("rebalance.case-right-left", caseVariables);
      recorder?.enter("right");
      right = rotateRightAt(right, recorder);
      recorder?.leave();
    } else {
      recorder?.emit("rebalance.case-right-right", caseVariables);
    }
    return rotateLeftAt(withChildren(node, node.left, right), recorder);
  }
  recorder?.emit("rebalance.balanced", { node: node.key, balance });
  return node;
};

const insertInto = (node: AvlNode | null, key: number, recorder?: StepRecorder): AvlNode => {
  if (!node) {
    const created: AvlNode = { key, height: 1, left: null, right: null };
    recorder?.replace(created);
    recorder?.focus(key);
    recorder?.mark(key, "new");
    recorder?.emit("insert.create-node", { key });
    return created;
  }
  recorder?.focus(node.key);
  recorder?.emit("insert.compare", { key, node: node.key });
  if (key < node.key) {
    recorder?.emit("insert.go-left", { key, node: node.key });
    recorder?.enter("left");
    const left = insertInto(node.left, key, recorder);
    recorder?.leave();
    return rebalanceAt(updateNode(node, left, node.right, recorder), recorder);
  }
  if (key > node.key) {
    recorder?.emit("insert.go-right", { key, node: node.key });
    recorder?.enter("right");
    const right = insertInto(node.right, key, recorder);
    recorder?.leave();
    return rebalanceAt(updateNode(node, node.left, right, recorder), recorder);
  }
  recorder?.emit("insert.duplicate", { key, node: node.key });
  return node;
};

const smallestKey = (node: AvlNode): number => (node.left ? smallestKey(node.left) : node.key);

const removeFrom = (node: AvlNode | null, key: number, recorder?: StepRecorder): AvlNode | null => {
  if (!node) {
    recorder?.emit("delete.not-found", { key });
    return null;
  }
  recorder?.focus(node.key);
  recorder?.emit("delete.compare", { key, node: node.key });
  if (key < node.key) {
    recorder?.emit("delete.go-left", { key, node: node.key });
    recorder?.enter("left");
    const left = removeFrom(node.left, key, recorder);
    recorder?.leave();
    return rebalanceAt(updateNode(node, left, node.right, recorder), recorder);
  }
  if (key > node.key) {
    recorder?.emit("delete.go-right", { key, node: node.key });
    recorder?.enter("right");
    const right = removeFrom(node.right, key, recorder);
    recorder?.leave();
    return rebalanceAt(updateNode(node, node.left, right, recorder), recorder);
  }
  if (!node.left || !node.right) {
    const child = node.left ?? node.right;
    recorder?.mark(node.key, "deleting");
    recorder?.emit("delete.replace-with-child", { key, child: child?.key ?? null });
    recorder?.replace(child);
    recorder?.clear(node.key);
    return child;
  }
  const successorKey = smallestKey(node.right);
  recorder?.mark(node.key, "deleting");
  recorder?.emit("delete.find-successor", { key, successor: successorKey });
  const copied: AvlNode = { ...node, key: successorKey };
  recorder?.replace(copied);
  recorder?.focus(successorKey);
  recorder?.emit("delete.copy-successor", { key, successor: successorKey });
  recorder?.enter("right");
  const right = removeFrom(node.right, successorKey, recorder);
  recorder?.leave();
  return rebalanceAt(updateNode(copied, node.left, right, recorder), recorder);
};

type RotationTarget = { node: AvlNode; path: ("left" | "right")[] };

const findRotationTarget = (root: AvlNode | null, key: number): RotationTarget | null => {
  const path: ("left" | "right")[] = [];
  let node = root;
  while (node && node.key !== key) {
    const direction = key < node.key ? "left" : "right";
    path.push(direction);
    node = node[direction];
  }
  return node ? { node, path } : null;
};

const rebuildPath = (
  node: AvlNode,
  path: readonly ("left" | "right")[],
  subtree: AvlNode,
): AvlNode => {
  const [direction, ...rest] = path;
  if (!direction) return subtree;
  const child = node[direction];
  if (!child) return node;
  const rebuilt = rebuildPath(child, rest, subtree);
  return direction === "left"
    ? withChildren(node, rebuilt, node.right)
    : withChildren(node, node.left, rebuilt);
};

const traceRotation = (
  root: AvlNode | null,
  key: number,
  rotate: (node: AvlNode, recorder?: StepRecorder) => AvlNode,
): SteppedResult<AvlNode | null> => {
  const recorder = new StepRecorder(root);
  const target = findRotationTarget(root, key);
  if (!root || !target) return recorder.finish(root);
  for (const direction of target.path) recorder.enter(direction);
  const rotated = rotate(target.node, recorder);
  return recorder.finish(rebuildPath(root, target.path, rotated));
};

export const rotateRight = (node: AvlNode): AvlNode => rotateRightAt(node);

export const rotateLeft = (node: AvlNode): AvlNode => rotateLeftAt(node);

export const rebalance = (node: AvlNode): AvlNode => rebalanceAt(node);

export const insertKey = (node: AvlNode | null, key: number): AvlNode => insertInto(node, key);

export const removeKey = (node: AvlNode | null, key: number): AvlNode | null =>
  removeFrom(node, key);

export const traceInsert = (root: AvlNode | null, key: number): SteppedResult<AvlNode> => {
  const recorder = new StepRecorder(root);
  return recorder.finish(insertInto(root, key, recorder));
};

export const traceRemove = (root: AvlNode | null, key: number): SteppedResult<AvlNode | null> => {
  const recorder = new StepRecorder(root);
  return recorder.finish(removeFrom(root, key, recorder));
};

export const traceRotateRight = (root: AvlNode | null, key: number) =>
  traceRotation(root, key, rotateRightAt);

export const traceRotateLeft = (root: AvlNode | null, key: number) =>
  traceRotation(root, key, rotateLeftAt);

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
