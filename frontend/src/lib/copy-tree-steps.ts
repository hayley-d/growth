import { type AvlNode, insertKey, layoutTree, TreeTraversal } from "@shared/avl";

export type CopyTreeStep = {
  copiedKeys: number[];
  currentKey: number | null;
  parentKey: number | null;
};

const emptyStep: CopyTreeStep = { copiedKeys: [], currentKey: null, parentKey: null };

export const copyTreeSteps = (startingKeys: readonly number[]) => {
  const root = startingKeys.reduce<AvlNode | null>((node, key) => insertKey(node, key), null);
  const parentByKey = new Map(
    layoutTree(root).map((position) => [position.key, position.parentKey]),
  );
  const order = [...new TreeTraversal(root, "preorder")].map((node) => node.key);
  const steps: CopyTreeStep[] = [
    emptyStep,
    ...order.map((key, index) => ({
      copiedKeys: order.slice(0, index + 1),
      currentKey: key,
      parentKey: parentByKey.get(key) ?? null,
    })),
  ];
  return { root, steps };
};

export const trimTree = (node: AvlNode | null, keys: readonly number[]): AvlNode | null => {
  if (!node || !keys.includes(node.key)) return null;
  return { ...node, left: trimTree(node.left, keys), right: trimTree(node.right, keys) };
};
