import { type AvlNode, insertKey, layoutTree, TreeTraversal } from "@shared/avl";

export type DeleteTreeStep = {
  deletedKeys: number[];
  currentKey: number | null;
  childKeys: number[];
};

const emptyStep: DeleteTreeStep = { deletedKeys: [], currentKey: null, childKeys: [] };

export const deleteTreeSteps = (startingKeys: readonly number[]) => {
  const root = startingKeys.reduce<AvlNode | null>((node, key) => insertKey(node, key), null);
  const childKeysByKey = new Map<number, number[]>();
  for (const position of layoutTree(root)) {
    if (position.parentKey === null) continue;
    childKeysByKey.set(position.parentKey, [
      ...(childKeysByKey.get(position.parentKey) ?? []),
      position.key,
    ]);
  }
  const order = [...new TreeTraversal(root, "postorder")].map((node) => node.key);
  const steps: DeleteTreeStep[] = [
    emptyStep,
    ...order.map((key, index) => ({
      deletedKeys: order.slice(0, index + 1),
      currentKey: key,
      childKeys: childKeysByKey.get(key) ?? [],
    })),
  ];
  return { root, steps };
};
