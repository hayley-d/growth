import { encodeTree } from "@shared/avl/src/tree-encoding";
import {
  acceptPrediction,
  createGeneratorRandom,
  describeRotation,
  findCase,
  type GenerateOptions,
  pivotHint,
} from "@shared/engine/src/generators/support";
import type { GeneratedQuestion } from "@shared/schemas";

export const generatePredictRotation = ({
  seed,
  difficulty,
}: GenerateOptions): GeneratedQuestion => {
  const operation = createGeneratorRandom(seed, 2)() < 0.5 ? "insert" : "delete";
  const found = findCase({ seed, difficulty, operation, accept: acceptPrediction(difficulty) });
  const action = operation === "insert" ? `Insert ${found.key} into` : `Delete ${found.key} from`;

  return {
    type: "predict_rotation",
    prompt: `${action} this AVL tree. Which rotation fixes the tree, and which node is the pivot (the lowest unbalanced node)? If no rotation is needed, choose none.`,
    tree: encodeTree(found.tree),
    answer: { type: "predict_rotation", rotation: found.rotation, pivotKey: found.pivotKey },
    explanation: describeRotation(found.rotation, found.pivotKey),
    hints: [
      "Do the change like in a plain binary search tree, then find the lowest node whose balance factor is -2 or 2. That node is the pivot.",
      found.rotation === "none"
        ? "Check the balance factor of each node on the path from the change back up to the root."
        : pivotHint(found.rotation, found.pivotKey),
      found.rotation === "none"
        ? pivotHint(found.rotation, found.pivotKey)
        : "Look at the child of the pivot on its heavy side. If that child leans the same way as the pivot, one rotation is enough. If it leans the other way, you need two.",
    ],
  };
};
