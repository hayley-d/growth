import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "playground",
  position: 3,
  style: "kinesthetic",
  transcript:
    "A tree with 50 at the root. 30 is on its left, with children 20 and 40. 70 is on its right, with children 60 and 80. Tap the first node in pre-order. The answer is 50, 30, 20, 40, 70, 60, 80.",
  body: {
    startingKeys: [50, 30, 70, 20, 40, 60, 80],
    allowedOperations: ["traverse"],
    instructions: "Tap the first node in pre-order.",
    goal: {
      kind: "traversal",
      order: "preorder",
      keys: [50, 30, 20, 40, 70, 60, 80],
    },
  },
} satisfies BlockContent;
