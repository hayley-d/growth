import { type AvlNode, findNode } from "@shared/avl/src/avl-tree";
import { encodeTree } from "@shared/avl/src/tree-encoding";
import { TreeTraversal } from "@shared/avl/src/tree-traversal";
import { balanceOf, heightOf } from "@shared/engine/src/balance";
import { insertBst } from "@shared/engine/src/bst";
import {
  acceptRotation,
  createGeneratorRandom,
  findCase,
  type GenerateOptions,
  makePlainTree,
  pickFrom,
} from "@shared/engine/src/generators/support";
import type { GeneratedQuestion } from "@shared/schemas";

const unrebalancedFrom = 4;

const nodesOf = (tree: AvlNode) => [...new TreeTraversal(tree, "preorder")];

const innerNodes = (tree: AvlNode) => {
  const nodes = nodesOf(tree);
  const inner = nodes.filter((node) => node.left || node.right);
  return inner.length > 0 ? inner : nodes;
};

export const generateBalanceFactor = ({ seed, difficulty }: GenerateOptions): GeneratedQuestion => {
  const random = createGeneratorRandom(seed, 3);
  const unrebalanced = difficulty >= unrebalancedFrom;
  const found = unrebalanced
    ? findCase({
        seed,
        difficulty,
        operation: "insert",
        accept: acceptRotation(difficulty),
        reservedNodes: 1,
      })
    : null;
  const tree = found ? insertBst(found.tree, found.key) : makePlainTree(seed, difficulty);
  const pivot = found?.pivotKey == null ? null : findNode(tree, found.pivotKey);
  const askAboutPivot = difficulty === 5 && pivot !== null && random() < 0.5;
  const candidates = difficulty === 1 ? nodesOf(tree) : innerNodes(tree);
  const node = askAboutPivot && pivot ? pivot : pickFrom(candidates, random);
  const leftHeight = heightOf(node.left);
  const rightHeight = heightOf(node.right);
  const balance = balanceOf(node);
  const context = found
    ? `The key ${found.key} was just added to this tree like in a plain binary search tree, and the tree has not been rebalanced yet. `
    : "";

  return {
    type: "text",
    prompt: `${context}What is the balance factor of node ${node.key}? Balance factor is the height of the left subtree minus the height of the right subtree. A leaf has height 1 and an empty subtree has height 0.`,
    tree: encodeTree(tree),
    answer: { type: "text", text: String(balance) },
    explanation: `The left subtree of ${node.key} has height ${leftHeight} and the right has height ${rightHeight}, so the balance factor is ${leftHeight} - ${rightHeight} = ${balance}.`,
    hints: [
      `Work out the height of the left and right subtree of ${node.key} separately.`,
      "A missing subtree counts as height 0, and a leaf has height 1.",
      `The left subtree has height ${leftHeight}.`,
    ],
  };
};
