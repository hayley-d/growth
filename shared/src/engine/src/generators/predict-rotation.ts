import { encodeTree } from "@shared/avl/src/tree-encoding";
import { insertBst } from "@shared/engine/src/bst";
import {
  acceptPrediction,
  createGeneratorRandom,
  describeRotation,
  findCase,
  type GenerateOptions,
} from "@shared/engine/src/generators/support";
import type { GeneratedQuestion } from "@shared/schemas";

// For the rotation lessons, which come before AVL insert and delete are taught:
// show a tree that is already out of balance and ask only for the fix.
const generateUnbalanced = ({ seed, difficulty }: GenerateOptions): GeneratedQuestion => {
  const found = findCase({
    seed,
    difficulty,
    operation: "insert",
    accept: acceptPrediction(difficulty),
  });

  return {
    type: "predict_rotation",
    prompt:
      "Is this tree out of balance? If it is, which rotation fixes it, and which node is the pivot (the lowest unbalanced node)? If it's balanced, choose none.",
    tree: encodeTree(insertBst(found.tree, found.key)),
    answer: { type: "predict_rotation", rotation: found.rotation, pivotKey: found.pivotKey },
    explanation: describeRotation(found.rotation, found.pivotKey),
    replay: null,
    hints: [
      "Work out the balance factor of each node, starting at the leaves. Balance factor is the left height minus the right height.",
      "Find the lowest node whose balance factor is -2 or 2. That node is the pivot. If no node reaches -2 or 2, no rotation is needed.",
      "Look at the pivot's taller child. If it leans the same way as the pivot, or is balanced, one rotation is enough. If it leans the other way, you need two.",
    ],
  };
};

export const generatePredictRotation = (options: GenerateOptions): GeneratedQuestion => {
  if (options.unbalanced) return generateUnbalanced(options);
  const { seed, difficulty, operation: chosenOperation } = options;
  const operation =
    chosenOperation ?? (createGeneratorRandom(seed, 2)() < 0.5 ? "insert" : "delete");
  const found = findCase({ seed, difficulty, operation, accept: acceptPrediction(difficulty) });
  const action = operation === "insert" ? `Insert ${found.key} into` : `Delete ${found.key} from`;

  return {
    type: "predict_rotation",
    prompt: `${action} this AVL tree. Which rotation fixes the tree, and which node is the pivot (the lowest unbalanced node)? If no rotation is needed, choose none.`,
    tree: encodeTree(found.tree),
    answer: { type: "predict_rotation", rotation: found.rotation, pivotKey: found.pivotKey },
    explanation: describeRotation(found.rotation, found.pivotKey),
    replay: { kind: "operation", operation, key: found.key },
    hints: [
      "Do the change like in a plain binary search tree, then find the lowest node whose balance factor is -2 or 2. That node is the pivot.",
      "Check the balance factor of each node on the path from the change back up to the root.",
      "Look at the child of the pivot on its heavy side. If that child leans the same way as the pivot, or is balanced, one rotation is enough. If it leans the other way, you need two. If no node reaches -2 or 2, no rotation is needed.",
    ],
  };
};
