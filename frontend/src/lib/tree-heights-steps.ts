import { type AvlNode, insertKey, TreeTraversal } from "@shared/avl";

export type TreeHeightsStep = {
  heights: Record<number, number>;
  currentKey: number | null;
  leftHeight: number;
  rightHeight: number;
};

const emptyStep: TreeHeightsStep = { heights: {}, currentKey: null, leftHeight: 0, rightHeight: 0 };

export const treeHeightsSteps = (startingKeys: readonly number[]) => {
  const root = startingKeys.reduce<AvlNode | null>((node, key) => insertKey(node, key), null);
  const heights: Record<number, number> = {};
  const steps: TreeHeightsStep[] = [emptyStep];
  for (const node of new TreeTraversal(root, "postorder")) {
    const leftHeight = node.left ? (heights[node.left.key] ?? 0) : 0;
    const rightHeight = node.right ? (heights[node.right.key] ?? 0) : 0;
    heights[node.key] = 1 + Math.max(leftHeight, rightHeight);
    steps.push({ heights: { ...heights }, currentKey: node.key, leftHeight, rightHeight });
  }
  return { root, steps };
};
