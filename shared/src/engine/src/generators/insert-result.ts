import { encodeTree } from "@shared/avl/src/tree-encoding";
import {
  acceptRotation,
  describeRotation,
  findCase,
  type GenerateOptions,
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
    replay: { kind: "operation", operation: "insert", key: found.key },
    hints: [
      "Insert like in a plain binary search tree first: smaller keys go left, larger keys go right.",
      `After inserting, check the balance factor of each node on the path from ${found.key} back up to the root.`,
      "The lowest node on that path with a balance factor of -2 or 2 is the one to fix. Look at its heavy child to decide between one rotation and two. If no node reaches -2 or 2, nothing needs fixing.",
    ],
  };
};
