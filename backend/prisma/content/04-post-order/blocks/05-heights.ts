import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "heights",
  position: 5,
  transcript:
    "Working out heights. Post-order traversal is useful when working out the height of a node in a tree. A node's height needs the height of both its subtrees first, which is why post-order traversal is used. The smallest height any node can have is 1, that would be a leaf node. An empty subtree has height 0. A node takes the larger of its two subtree heights and adds 1 for itself. The code. Line 1: height of node. Line 2: if node is empty, return 0. Line 3: left equals height of node dot left. Line 4: right equals height of node dot right. Line 5: return 1 plus the larger of left and right. Press Step to work out the heights of the tree with 8 at the root. 2, 6, 10 and 14 are leaves, so they get height 1. 4 and 12 get 1 plus 1, which is 2. 8 gets 1 plus 2, which is 3.",
  body: {
    startingKeys: [8, 4, 12, 2, 6, 10, 14],
    caption: "A node's height is 1 more than its taller subtree.",
    markdown:
      "## Working out heights\n\nPost-order traversal is useful when working out the height of a node in a tree. A node's height needs the height of both its subtrees first, which is why post-order traversal is used. The smallest height any node can have is 1, that would be a leaf node.\n\nTo get a node's height, take the larger of its two subtree heights and add 1 for the node itself. An empty subtree has height 0, so a leaf is 1 + 0 = 1.\n\n```\nheight(node):\n  if node is empty: return 0\n  left = height(node.left)\n  right = height(node.right)\n  return 1 + max(left, right)\n```\n\nPress **Step** to work out the height of each node, in post-order.",
  },
} satisfies BlockContent;
