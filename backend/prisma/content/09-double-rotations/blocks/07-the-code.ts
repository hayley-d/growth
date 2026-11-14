import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "code_trace",
  position: 7,
  transcript:
    "The code. The tree has 50 at the root, 20 on its left with children 10 and 30, and 70 on its right. Insert 40 and step through rebalance. At 50 the balance factor is more than 1, so the code checks the left child. 20 has balance factor minus 1, which is less than 0, so the path turns. The line node dot left equals rotate left of node dot left straightens it by rotating 20. The line return rotate right of node fixes it by rotating 50. There is no special code for a double rotation. It is two single rotations, one after the other.",
  body: {
    algorithmCode: "rebalance",
    startingKeys: [50, 20, 70, 10, 30],
    operation: { operation: "insert", key: 40 },
    markdown:
      "## The code\n\nPress **Step** and watch `rebalance` at `50`.\n\n- `50` has balance factor +2, so the code checks its left child.\n- `20` has balance factor −1, which is less than 0, so the path turns.\n- `node.left = rotateLeft(node.left)` **straightens** it by rotating `20`.\n- `return rotateRight(node)` **fixes** it by rotating `50`.\n\nThere is no special code for a double rotation. It is two single rotations, one after the other.",
  },
} satisfies BlockContent;
