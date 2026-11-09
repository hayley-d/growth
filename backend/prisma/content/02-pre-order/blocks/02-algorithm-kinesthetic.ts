import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "playground",
  position: 2,
  style: "kinesthetic",
  transcript:
    "A tree with 20 at the root. 10 is on its left. 30 is on its right. Use the rule: tap the node, then its left side, then its right side. The answer is 20, 10, 30.",
  body: {
    startingKeys: [20, 10, 30],
    allowedOperations: ["traverse"],
    instructions: "Use the rule: tap the node, then its left side, then its right side.",
    goal: {
      kind: "traversal",
      order: "preorder",
      keys: [20, 10, 30],
    },
  },
} satisfies BlockContent;
