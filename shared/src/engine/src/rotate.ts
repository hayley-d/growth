import { type AvlNode, rotateLeft, rotateRight } from "@shared/avl/src/avl-tree";
import type { Step } from "@shared/engine/src/step";

export type RotateKind = "left" | "right";

export type RotateResult =
  | { ok: true; tree: AvlNode; steps: Step[] }
  | { ok: false; reason: string };

const heightOf = (node: AvlNode | null) => node?.height ?? 0;

const balanceOf = (node: AvlNode) => heightOf(node.left) - heightOf(node.right);

const withChildren = (node: AvlNode, left: AvlNode | null, right: AvlNode | null): AvlNode => ({
  key: node.key,
  left,
  right,
  height: 1 + Math.max(heightOf(left), heightOf(right)),
});

const findNode = (node: AvlNode | null, key: number): AvlNode | null => {
  if (!node) return null;
  if (key === node.key) return node;
  return findNode(key < node.key ? node.left : node.right, key);
};

const turn = (node: AvlNode, kind: RotateKind): AvlNode =>
  kind === "right" ? rotateRight(node) : rotateLeft(node);

const replaceAt = (
  node: AvlNode | null,
  key: number,
  kind: RotateKind,
): { node: AvlNode } | { reason: string } => {
  if (!node) return { reason: `Node ${key} is not in the tree` };
  if (node.key === key) return { node: turn(node, kind) };
  if (key < node.key) {
    const next = replaceAt(node.left, key, kind);
    if ("reason" in next) return next;
    return { node: withChildren(node, next.node, node.right) };
  }
  const next = replaceAt(node.right, key, kind);
  if ("reason" in next) return next;
  return { node: withChildren(node, node.left, next.node) };
};

export const rotate = (tree: AvlNode | null, key: number, kind: RotateKind): RotateResult => {
  const node = findNode(tree, key);
  if (!node) return { ok: false, reason: `Node ${key} is not in the tree` };
  if (kind === "right" && !node.left) return { ok: false, reason: `Node ${key} has no left child` };
  if (kind === "left" && !node.right)
    return { ok: false, reason: `Node ${key} has no right child` };

  const replaced = replaceAt(tree, key, kind);
  if ("reason" in replaced) return { ok: false, reason: replaced.reason };

  const variables = { key, kind };
  const selected: Step = {
    stepKey: "rotate.select",
    tree,
    nodeStates: { [key]: Math.abs(balanceOf(node)) > 1 ? "unbalanced" : "active" },
    message: `Select ${key} for a ${kind} rotation.`,
    variables,
  };
  const turned: Step = {
    stepKey: kind === "right" ? "rotate.rotate-right" : "rotate.rotate-left",
    tree: replaced.node,
    nodeStates: { [key]: "active" },
    message: `Rotate ${kind} at ${key}.`,
    variables,
  };
  return { ok: true, tree: replaced.node, steps: [selected, turned] };
};
