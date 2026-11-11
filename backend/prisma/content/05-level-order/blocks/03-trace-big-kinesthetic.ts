import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "playground",
  position: 3,
  style: "kinesthetic",
  transcript:
    "A tree with 45 at the root. 23 is on its left, with children 14 and 36. 76 is on its right, with children 58 and 88. Tap the nodes in level-order. The answer is 45, 23, 76, 14, 36, 58, 88.",
  body: {
    startingKeys: [45, 23, 76, 14, 36, 58, 88],
    allowedOperations: ["traverse"],
    instructions: "Tap the nodes in level-order.",
    goal: {
      kind: "traversal",
      order: "levelorder",
      keys: [45, 23, 76, 14, 36, 58, 88],
    },
  },
} satisfies BlockContent;
