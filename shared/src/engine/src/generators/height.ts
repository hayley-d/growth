import type { AvlNode } from "@shared/avl/src/avl-tree";
import { encodeTree } from "@shared/avl/src/tree-encoding";
import { TreeTraversal } from "@shared/avl/src/tree-traversal";
import { heightOf } from "@shared/engine/src/balance";
import {
  createGeneratorRandom,
  type GenerateOptions,
  makeTreeShaped,
  pickFrom,
} from "@shared/engine/src/generators/support";
import type { GeneratedQuestion } from "@shared/schemas";

const longestPath = (node: AvlNode): number[] => {
  const taller = heightOf(node.left) >= heightOf(node.right) ? node.left : node.right;
  return [node.key, ...(taller ? longestPath(taller) : [])];
};

export const generateHeight = ({ seed, difficulty, shape }: GenerateOptions): GeneratedQuestion => {
  const random = createGeneratorRandom(seed, 4);
  const tree = makeTreeShaped(seed, difficulty, shape);
  const nodes = [...new TreeTraversal(tree, "preorder")];
  const inner = nodes.filter((node) => node.left || node.right);
  const wholeTree = random() < 0.4;
  const target = wholeTree
    ? tree
    : pickFrom(difficulty >= 2 && inner.length > 0 ? inner : nodes, random);
  const height = heightOf(target);
  const path = longestPath(target).join(" → ");
  const subject = wholeTree ? "this tree" : `the subtree rooted at node ${target.key}`;

  return {
    type: "text",
    prompt: `What is the height of ${subject}? A leaf has height 1 and an empty tree has height 0.`,
    tree: encodeTree(tree),
    answer: { type: "text", text: String(height) },
    explanation: `The longest path down from ${target.key} is ${path}, which has ${height} nodes, so the height is ${height}.`,
    hints: [
      "Height counts the nodes on the longest path down to a leaf. A leaf has height 1.",
      "The height of a node is 1 plus the larger height of its two subtrees.",
      `The longest path goes ${path}.`,
    ],
  };
};
