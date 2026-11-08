import { toKeys } from "@shared/avl/src/avl-tree";
import { encodeTree } from "@shared/avl/src/tree-encoding";
import { type TraversalOrder, TreeTraversal } from "@shared/avl/src/tree-traversal";
import {
  createGeneratorRandom,
  type GenerateOptions,
  makePlainTree,
  pickFrom,
} from "@shared/engine/src/generators/support";
import type { GeneratedQuestion } from "@shared/schemas";

const orders: readonly TraversalOrder[] = ["preorder", "inorder", "postorder", "levelorder"];

const orderNames: Record<TraversalOrder, string> = {
  preorder: "pre-order",
  inorder: "in-order",
  postorder: "post-order",
  levelorder: "level-order",
};

const orderRules: Record<TraversalOrder, string> = {
  preorder: "the node first, then its left subtree, then its right subtree",
  inorder: "the left subtree first, then the node, then its right subtree",
  postorder: "the left subtree first, then its right subtree, then the node",
  levelorder: "one level at a time from the root down, each level from left to right",
};

export const generateTraversalOrder = ({
  seed,
  difficulty,
  order,
}: GenerateOptions): GeneratedQuestion => {
  const random = createGeneratorRandom(seed, 1);
  const tree = makePlainTree(seed, difficulty);
  const chosenOrder = order ?? pickFrom(orders, random);
  const keys = [...new TreeTraversal(tree, chosenOrder)].map((node) => node.key);
  const asText = random() < 0.5;
  const name = orderNames[chosenOrder];
  const title = `${name.charAt(0).toUpperCase()}${name.slice(1)}`;
  const prompt = asText
    ? `List the keys of this tree in the order a ${name} traversal visits them. Type the keys separated by commas, like 1,2,3.`
    : `Put the keys of this tree in the order a ${name} traversal visits them.`;
  const answer = asText
    ? ({ type: "text", text: keys.join(",") } as const)
    : ({ type: "order_nodes", keys } as const);

  return {
    type: answer.type,
    prompt,
    tree: encodeTree(tree),
    answer,
    explanation: `${title} visits ${orderRules[chosenOrder]}. For this tree that gives ${keys.join(", ")}.`,
    hints: [
      `${title} traversal visits ${orderRules[chosenOrder]}.`,
      `The root is ${tree.key}. It has ${toKeys(tree.left).length} keys in its left subtree and ${toKeys(tree.right).length} in its right.`,
      `The answer starts with ${keys.slice(0, Math.max(1, Math.floor(keys.length / 2))).join(",")}.`,
    ],
  };
};
