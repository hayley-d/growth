import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "playground",
  position: 5,
  style: "kinesthetic",
  transcript:
    "A tree with 10 at the root and 20 on its right. Insert 30. If 10 leans too far right, rotate it left. After a left rotation at 10, 20 is the root, with 10 on the left and 30 on the right. Pre-order is 20, 10, 30.",
  body: {
    startingKeys: [10, 20],
    allowedOperations: ["insert", "rotateLeft"],
    instructions: "Insert 30. If 10 leans right, rotate it left.",
    goal: { kind: "traversal", order: "preorder", keys: [20, 10, 30] },
  },
} satisfies BlockContent;
