import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "playground",
  position: 7,
  style: "kinesthetic",
  transcript:
    "A tree with 15 at the root. 7 is on its left. 22 is on its right. Tap the first node in pre-order. The answer is 15, 7, 22.",
  body: {
    startingKeys: [15, 7, 22],
    allowedOperations: ["traverse"],
    instructions: "Tap the first node in pre-order.",
    goal: {
      kind: "traversal",
      order: "preorder",
      keys: [15, 7, 22],
    },
  },
} satisfies BlockContent;
