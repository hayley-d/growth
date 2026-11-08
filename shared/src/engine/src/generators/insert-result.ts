import { encodeTree } from "@shared/avl/src/tree-encoding";
import {
  acceptRotation,
  describeRotation,
  findCase,
  type GenerateOptions,
  pivotHint,
} from "@shared/engine/src/generators/support";
import type { GeneratedQuestion } from "@shared/schemas";

export const generateInsertResult = ({ seed, difficulty }: GenerateOptions): GeneratedQuestion => {
  const found = findCase({
    seed,
    difficulty,
    operation: "insert",
    accept: acceptRotation(difficulty),
  });
  const result = encodeTree(found.result);

  return {
    type: "build_tree",
    prompt: `Insert ${found.key} into this AVL tree and rebalance if needed. Build the tree you get.`,
    tree: encodeTree(found.tree),
    answer: { type: "build_tree", tree: result },
    explanation: `${found.key} goes in like in a plain binary search tree. ${describeRotation(found.rotation, found.pivotKey)}`,
    hints: [
      "Insert like in a plain binary search tree first: smaller keys go left, larger keys go right.",
      `After inserting, check the balance factor of each node on the path from ${found.key} back up to the root.`,
      `${pivotHint(found.rotation, found.pivotKey)} ${describeRotation(found.rotation, found.pivotKey)}`,
    ],
  };
};
