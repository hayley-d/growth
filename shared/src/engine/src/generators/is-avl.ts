import { type AvlNode, toKeys } from "@shared/avl/src/avl-tree";
import { encodeTree } from "@shared/avl/src/tree-encoding";
import { balanceOf, findUnbalanced, isAvl } from "@shared/engine/src/balance";
import { insertBst } from "@shared/engine/src/bst";
import {
  createGeneratorRandom,
  type GenerateOptions,
  makePlainTree,
  makeUuid,
  type Random,
  shuffle,
  sizeFor,
  unusedKeys,
} from "@shared/engine/src/generators/support";
import type { GeneratedQuestion } from "@shared/schemas";

const maximumAttempts = 500;

const makeInvalidTree = (
  seed: number,
  difficulty: GenerateOptions["difficulty"],
  random: Random,
): AvlNode => {
  for (let attempt = 0; attempt < maximumAttempts; attempt += 1) {
    const keys = shuffle(unusedKeys(null), random).slice(0, sizeFor(seed, difficulty, attempt));
    const tree = keys.reduce<AvlNode | null>(insertBst, null);
    if (!tree || isAvl(tree)) continue;
    if (difficulty >= 2 && Math.abs(balanceOf(tree)) > 1) continue;
    return tree;
  }
  throw new Error(`No invalid AVL tree found for seed ${seed} at difficulty ${difficulty}`);
};

export const generateIsAvl = ({ seed, difficulty }: GenerateOptions): GeneratedQuestion => {
  const random = createGeneratorRandom(seed, 5);
  const valid = random() < 0.5;
  const tree = valid ? makePlainTree(seed, difficulty) : makeInvalidTree(seed, difficulty, random);
  const yesId = makeUuid(random);
  const noId = makeUuid(random);
  const unbalanced = findUnbalanced(tree).reduce<AvlNode | null>(
    (lowest, node) => (lowest && lowest.height <= node.height ? lowest : node),
    null,
  );
  const reason = unbalanced
    ? `Node ${unbalanced.key} has a balance factor of ${balanceOf(unbalanced)}, which is outside -1 to 1.`
    : `Every node has a balance factor of -1, 0 or 1 (${toKeys(tree).length} nodes checked).`;

  return {
    type: "multiple_choice",
    prompt: "Is this tree a valid AVL tree?",
    tree: encodeTree(tree),
    options: [
      { id: yesId, text: "Yes, it is a valid AVL tree" },
      { id: noId, text: "No, it is not a valid AVL tree" },
    ],
    answer: { type: "multiple_choice", optionId: valid ? yesId : noId },
    explanation: reason,
    hints: [
      "An AVL tree is a binary search tree where the two subtrees of every node differ in height by at most 1.",
      "Check the balance factor of every node, not just the root.",
      "Write each node's height next to it, working from the leaves up, then subtract the right height from the left.",
    ],
  };
};
