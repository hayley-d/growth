import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "playground",
  position: 3,
  style: "kinesthetic",
  transcript:
    "A tree with 45 at the root. 23 is on its left, with children 14 and 36. 76 is on its right, with children 58 and 88. Tap the nodes in post-order. The answer is 14, 36, 23, 58, 88, 76, 45.",
  body: {
    startingKeys: [45, 23, 76, 14, 36, 58, 88],
    allowedOperations: ["traverse"],
    instructions: "Tap the nodes in post-order.",
    goal: {
      kind: "traversal",
      order: "postorder",
      keys: [14, 36, 23, 58, 88, 76, 45],
    },
  },
} satisfies BlockContent;
