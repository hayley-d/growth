import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "traversal_quiz",
  position: 7,
  transcript:
    "Compare all three. Pre-order, in-order and post-order are all depth-first traversals. The only difference between them is when the node is visited. Pre-order visits the node before its subtrees, in-order visits the node after its left subtree and before its right subtree and post-order visits the node after both its subtrees. You can see this in the code as well. In pre-order, visit node is on line 3, before both calls. In in-order, it's on line 4, between the calls. In post-order, it's on line 5, after both calls. Given the following tree, type in the order of the nodes for each traversal. The tree has 30 at the root. 15 is on its left, with children 10 and 20. 45 is on its right, with 40 on its left. The answers are: pre-order 30, 15, 10, 20, 45, 40. In-order 10, 15, 20, 30, 40, 45. Post-order 10, 20, 15, 40, 45, 30.",
  body: {
    startingKeys: [30, 15, 45, 10, 20, 40],
    orders: ["preorder", "inorder", "postorder"],
    markdown:
      "## Compare all three\n\nPre-order, in-order and post-order are all depth-first traversals. The only difference between them is when the node is visited. Pre-order visits the node before its subtrees, in-order visits the node after its left subtree and before its right subtree and post-order visits the node after both its subtrees.\n\nYou can see this in the code as well.\n\n```\npreorder(node):\n  if node is empty: return\n  visit(node)\n  preorder(node.left)\n  preorder(node.right)\n```\n\n```\ninorder(node):\n  if node is empty: return\n  inorder(node.left)\n  visit(node)\n  inorder(node.right)\n```\n\n```\npostorder(node):\n  if node is empty: return\n  postorder(node.left)\n  postorder(node.right)\n  visit(node)\n```\n\nGiven the following tree, type in the order of the nodes for each traversal.",
  },
} satisfies BlockContent;
