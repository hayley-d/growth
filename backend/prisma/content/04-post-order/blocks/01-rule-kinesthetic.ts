import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "playground",
  position: 1,
  style: "kinesthetic",
  transcript:
    "A tree with 20 at the root. 10 is on its left. 30 is on its right. Use the rule: tap the left side, then the right side, then the node. The answer is 10, 30, 20.",
  body: {
    startingKeys: [20, 10, 30],
    allowedOperations: ["traverse"],
    instructions: "Use the rule: tap the left side, then the right side, then the node.",
    goal: {
      kind: "traversal",
      order: "postorder",
      keys: [10, 30, 20],
    },
  },
} satisfies BlockContent;
