import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "traversal_quiz",
  position: 6,
  transcript:
    "Compare all four. Pre-order, in-order and post-order go deep. They use recursion, and the call stack remembers where to come back to. Level-order goes across. It uses a loop and a queue instead. Given the following tree, type in the order of the nodes for each traversal. The tree has 30 at the root. 15 is on its left, with children 10 and 20. 45 is on its right, with 40 on its left. The answers are: pre-order 30, 15, 10, 20, 45, 40. In-order 10, 15, 20, 30, 40, 45. Post-order 10, 20, 15, 40, 45, 30. Level-order 30, 15, 45, 10, 20, 40.",
  body: {
    startingKeys: [30, 15, 45, 10, 20, 40],
    orders: ["preorder", "inorder", "postorder", "levelorder"],
    markdown:
      "## Compare all four\n\nPre-order, in-order and post-order go **deep**. They use recursion, and the call stack remembers where to come back to.\n\nLevel-order goes **across**. It uses a loop and a queue instead, and it visits every node on one row before it moves down to the next.\n\nGiven the following tree, type in the order of the nodes for each traversal.",
  },
} satisfies BlockContent;
