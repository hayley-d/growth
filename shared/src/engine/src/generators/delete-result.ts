import { encodeTree } from "@shared/avl/src/tree-encoding";
import {
  acceptDelete,
  describeRotation,
  findCase,
  type GenerateOptions,
} from "@shared/engine/src/generators/support";
import type { GeneratedQuestion } from "@shared/schemas";

export const generateDeleteResult = ({ seed, difficulty }: GenerateOptions): GeneratedQuestion => {
  const found = findCase({
    seed,
    difficulty,
    operation: "delete",
    accept: acceptDelete(difficulty),
  });
  const replacedKey = found.pivotIsSuccessor ? found.key : null;
  const successorNote = found.twoChildren
    ? `${found.key} has two children, so it is replaced by its in-order successor. `
    : "";

  return {
    type: "build_tree",
    prompt: `Delete ${found.key} from this AVL tree and rebalance if needed. Build the tree you get.`,
    tree: encodeTree(found.tree),
    answer: { type: "build_tree", tree: encodeTree(found.result) },
    explanation: `${successorNote}${describeRotation(found.rotation, found.pivotKey, replacedKey)}`,
    replay: { kind: "operation", operation: "delete", key: found.key },
    hints: [
      "Delete like in a plain binary search tree. A node with two children is replaced by its in-order successor, the smallest key in its right subtree.",
      "After deleting, check the balance factor of each node on the path from where the node was removed back up to the root.",
      "The lowest node on that path with a balance factor of -2 or 2 is the one to fix. Look at its heavy child to decide between one rotation and two. If no node reaches -2 or 2, nothing needs fixing.",
    ],
  };
};
