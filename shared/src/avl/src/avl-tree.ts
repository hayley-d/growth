import {
  type RotationRole,
  type SteppedResult,
  StepRecorder,
  withinCall,
  withinRotation,
} from "@shared/avl/src/step-recorder";

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

export type RotationDirection = "left" | "right";

export type OpenSpot = {
  parentKey: number | null;
  side: RotationDirection | null;
  low: number;
  high: number;
};

const heightOf = (node: AvlNode | null) => node?.height ?? 0;

export const findNode = (root: AvlNode | null, key: number): AvlNode | null => {
  let node = root;
  while (node && node.key !== key) node = key < node.key ? node.left : node.right;
  return node;
};

export const parentOf = (root: AvlNode | null, key: number): AvlNode | null => {
  let parent: AvlNode | null = null;
  let node = root;
  while (node && node.key !== key) {
    parent = node;
    node = key < node.key ? node.left : node.right;
  }
  return node ? parent : null;
};

export const pivotOf = (node: AvlNode, direction: RotationDirection): AvlNode | null =>
  direction === "left" ? node.right : node.left;

export const canRotate = (root: AvlNode | null, key: number, direction: RotationDirection) => {
  const node = findNode(root, key);
  return node !== null && pivotOf(node, direction) !== null;
};

export const openSpots = (root: AvlNode | null, low: number, high: number): OpenSpot[] => {
  if (!root) return low <= high ? [{ parentKey: null, side: null, low, high }] : [];
  const spots: OpenSpot[] = [];
  const visit = (node: AvlNode, from: number, to: number) => {
    if (node.left) visit(node.left, from, node.key - 1);
    else if (from <= node.key - 1) {
      spots.push({ parentKey: node.key, side: "left", low: from, high: node.key - 1 });
    }
    if (node.right) visit(node.right, node.key + 1, to);
    else if (node.key + 1 <= to) {
      spots.push({ parentKey: node.key, side: "right", low: node.key + 1, high: to });
    }
  };
  visit(root, low, high);
  return spots;
};

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
  return withinCall(recorder, "update-height", updated.key, () => {
    recorder?.emit("update-height.compute-height", { node: updated.key, height: updated.height });
    recorder?.emit("update-height.compute-balance", {
      node: updated.key,
      balance: balanceOf(updated),
      leftHeight: heightOf(left),
      rightHeight: heightOf(right),
    });
    return updated;
  });
};

const rotateRightAt = (node: AvlNode, recorder?: StepRecorder): AvlNode =>
  withinCall(recorder, "rotate-right", node.key, () => {
    const pivot = pivotOf(node, "right");
    recorder?.focus(node.key);
    recorder?.emit("rotate-right.check-pivot", { node: node.key, pivot: pivot?.key ?? null });
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
    recorder?.emit("rotate-right.done", { node: node.key, pivot: pivot.key });
    return rotated;
  });

const rotateLeftAt = (node: AvlNode, recorder?: StepRecorder): AvlNode =>
  withinCall(recorder, "rotate-left", node.key, () => {
    const pivot = pivotOf(node, "left");
    recorder?.focus(node.key);
    recorder?.emit("rotate-left.check-pivot", { node: node.key, pivot: pivot?.key ?? null });
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
    recorder?.emit("rotate-left.done", { node: node.key, pivot: pivot.key });
    return rotated;
  });

const rotationRoles = (
  unbalanced: AvlNode,
  ...others: (AvlNode | null)[]
): Record<number, RotationRole> => {
  const roles: Record<number, RotationRole> = { [unbalanced.key]: "unbalanced" };
  for (const other of others) if (other) roles[other.key] = "rotating";
  return roles;
};

const rebalanceAt = (node: AvlNode, recorder?: StepRecorder): AvlNode =>
  withinCall(recorder, "rebalance", node.key, () => {
    const balance = balanceOf(node);
    recorder?.focus(node.key);
    recorder?.emit("rebalance.check", { node: node.key, balance });
    const leftHeavy = balance > 1 ? node.left : null;
    const rightHeavy = balance < -1 ? node.right : null;
    if (!leftHeavy && !rightHeavy) {
      recorder?.emit("rebalance.balanced", { node: node.key, balance });
      return node;
    }
    if (leftHeavy) {
      const caseVariables = {
        node: node.key,
        balance,
        child: leftHeavy.key,
        childBalance: balanceOf(leftHeavy),
      };
      const single = caseVariables.childBalance >= 0;
      const third = single ? leftHeavy.left : leftHeavy.right;
      return withinRotation(
        recorder,
        { node: node.key, label: single ? "LL" : "LR" },
        rotationRoles(node, leftHeavy, third),
        () => {
          recorder?.emit("rebalance.check-side", { node: node.key, balance });
          recorder?.emit("rebalance.check-left-child", caseVariables);
          if (single) {
            recorder?.emit("rebalance.case-left-left", caseVariables);
            return rotateRightAt(node, recorder);
          }
          recorder?.emit("rebalance.case-left-right", caseVariables);
          recorder?.enter("left");
          const left = rotateLeftAt(leftHeavy, recorder);
          recorder?.leave();
          recorder?.focus(node.key);
          recorder?.emit("rebalance.finish-left-right", { node: node.key });
          return rotateRightAt(withChildren(node, left, node.right), recorder);
        },
      );
    }
    if (rightHeavy) {
      const caseVariables = {
        node: node.key,
        balance,
        child: rightHeavy.key,
        childBalance: balanceOf(rightHeavy),
      };
      const single = caseVariables.childBalance <= 0;
      const third = single ? rightHeavy.right : rightHeavy.left;
      return withinRotation(
        recorder,
        { node: node.key, label: single ? "RR" : "RL" },
        rotationRoles(node, rightHeavy, third),
        () => {
          recorder?.emit("rebalance.check-side", { node: node.key, balance });
          recorder?.emit("rebalance.check-right-child", caseVariables);
          if (single) {
            recorder?.emit("rebalance.case-right-right", caseVariables);
            return rotateLeftAt(node, recorder);
          }
          recorder?.emit("rebalance.case-right-left", caseVariables);
          recorder?.enter("right");
          const rotatedRight = rotateRightAt(rightHeavy, recorder);
          recorder?.leave();
          recorder?.focus(node.key);
          recorder?.emit("rebalance.finish-right-left", { node: node.key });
          return rotateLeftAt(withChildren(node, node.left, rotatedRight), recorder);
        },
      );
    }
    return node;
  });

type Climb = (
  algorithm: "insert" | "delete",
  node: AvlNode,
  left: AvlNode | null,
  right: AvlNode | null,
  recorder?: StepRecorder,
) => AvlNode;

const plainClimb: Climb = (_algorithm, node, left, right, recorder) => {
  const rebuilt = withChildren(node, left, right);
  recorder?.replace(rebuilt);
  return rebuilt;
};

const rebalancingClimb: Climb = (algorithm, node, left, right, recorder) => {
  recorder?.focus(node.key);
  recorder?.emit(`${algorithm}.update-height`, { node: node.key });
  const updated = updateNode(node, left, right, recorder);
  recorder?.emit(`${algorithm}.rebalance`, { node: updated.key });
  return rebalanceAt(updated, recorder);
};

const makeInsert = (climb: Climb) => {
  const insertInto = (node: AvlNode | null, key: number, recorder?: StepRecorder): AvlNode =>
    withinCall(recorder, "insert", node?.key ?? null, () => {
      if (node) recorder?.focus(node.key);
      recorder?.emit("insert.check-empty", { key, node: node?.key ?? null });
      if (!node) {
        const created: AvlNode = { key, height: 1, left: null, right: null };
        recorder?.replace(created);
        recorder?.focus(key);
        recorder?.mark(key, "new");
        recorder?.emit("insert.create-node", { key });
        return created;
      }
      recorder?.emit("insert.compare", { key, node: node.key });
      if (key < node.key) {
        recorder?.emit("insert.go-left", { key, node: node.key });
        recorder?.enter("left");
        const left = insertInto(node.left, key, recorder);
        recorder?.leave();
        return climb("insert", node, left, node.right, recorder);
      }
      recorder?.emit("insert.check-bigger", { key, node: node.key });
      if (key > node.key) {
        recorder?.emit("insert.go-right", { key, node: node.key });
        recorder?.enter("right");
        const right = insertInto(node.right, key, recorder);
        recorder?.leave();
        return climb("insert", node, node.left, right, recorder);
      }
      recorder?.emit("insert.duplicate", { key, node: node.key });
      return node;
    });
  return insertInto;
};

const smallestKey = (node: AvlNode): number => (node.left ? smallestKey(node.left) : node.key);

const makeRemove = (climb: Climb) => {
  const removeFrom = (node: AvlNode | null, key: number, recorder?: StepRecorder): AvlNode | null =>
    withinCall(recorder, "delete", node?.key ?? null, (): AvlNode | null => {
      if (node) recorder?.focus(node.key);
      recorder?.emit("delete.check-empty", { key, node: node?.key ?? null });
      if (!node) {
        recorder?.emit("delete.not-found", { key });
        return null;
      }
      recorder?.emit("delete.compare", { key, node: node.key });
      if (key < node.key) {
        recorder?.emit("delete.go-left", { key, node: node.key });
        recorder?.enter("left");
        const left = removeFrom(node.left, key, recorder);
        recorder?.leave();
        return climb("delete", node, left, node.right, recorder);
      }
      recorder?.emit("delete.check-bigger", { key, node: node.key });
      if (key > node.key) {
        recorder?.emit("delete.go-right", { key, node: node.key });
        recorder?.enter("right");
        const right = removeFrom(node.right, key, recorder);
        recorder?.leave();
        return climb("delete", node, node.left, right, recorder);
      }
      const children = (node.left ? 1 : 0) + (node.right ? 1 : 0);
      recorder?.emit("delete.check-children", { key, children });
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
      recorder?.emit("delete.remove-successor", { key, successor: successorKey });
      recorder?.enter("right");
      const right = removeFrom(node.right, successorKey, recorder);
      recorder?.leave();
      return climb("delete", copied, node.left, right, recorder);
    });
  return removeFrom;
};

const insertInto = makeInsert(rebalancingClimb);
const removeFrom = makeRemove(rebalancingClimb);
const insertIntoBst = makeInsert(plainClimb);
const removeFromBst = makeRemove(plainClimb);

type RotationTarget = { node: AvlNode; path: RotationDirection[] };

const findRotationTarget = (root: AvlNode | null, key: number): RotationTarget | null => {
  const path: RotationDirection[] = [];
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
  path: readonly RotationDirection[],
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
  direction: RotationDirection,
  rotate: (node: AvlNode, recorder?: StepRecorder) => AvlNode,
): SteppedResult<AvlNode | null> => {
  const recorder = new StepRecorder(root);
  const target = findRotationTarget(root, key);
  if (!root || !target) return recorder.finish(root);
  for (const step of target.path) recorder.enter(step);
  const node = target.node;
  const pivot = pivotOf(node, direction);
  const roles: Record<number, RotationRole> = {
    [node.key]: Math.abs(balanceOf(node)) > 1 ? "unbalanced" : "rotating",
  };
  if (pivot) roles[pivot.key] = "rotating";
  const rotated = withinRotation(recorder, { node: node.key, label: direction }, roles, () =>
    rotate(node, recorder),
  );
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

export const insertBst = (node: AvlNode | null, key: number): AvlNode => insertIntoBst(node, key);

export const removeBst = (node: AvlNode | null, key: number): AvlNode | null =>
  removeFromBst(node, key);

export const traceBstInsert = (root: AvlNode | null, key: number): SteppedResult<AvlNode> => {
  const recorder = new StepRecorder(root);
  return recorder.finish(insertIntoBst(root, key, recorder));
};

export const traceBstRemove = (
  root: AvlNode | null,
  key: number,
): SteppedResult<AvlNode | null> => {
  const recorder = new StepRecorder(root);
  return recorder.finish(removeFromBst(root, key, recorder));
};

export type TreeMode = "bst" | "avl";

export const buildTreeFromKeys = (keys: readonly number[], mode: TreeMode = "avl") =>
  keys.reduce<AvlNode | null>(
    (tree, key) => (mode === "bst" ? insertBst(tree, key) : insertKey(tree, key)),
    null,
  );

export const traceRotateRight = (root: AvlNode | null, key: number) =>
  traceRotation(root, key, "right", rotateRightAt);

export const traceRotateLeft = (root: AvlNode | null, key: number) =>
  traceRotation(root, key, "left", rotateLeftAt);

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
