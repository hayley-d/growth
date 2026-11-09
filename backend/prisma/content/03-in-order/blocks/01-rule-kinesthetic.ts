import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "playground",
  position: 1,
  style: "kinesthetic",
  transcript:
    "A tree with 20 at the root. 10 is on its left. 30 is on its right. Use the rule: tap the left side, then the node, then the right side. The answer is 10, 20, 30.",
  body: {
    startingKeys: [20, 10, 30],
    allowedOperations: ["traverse"],
    instructions: "Use the rule: tap the left side, then the node, then the right side.",
    goal: {
      kind: "traversal",
      order: "inorder",
      keys: [10, 20, 30],
    },
  },
} satisfies BlockContent;
