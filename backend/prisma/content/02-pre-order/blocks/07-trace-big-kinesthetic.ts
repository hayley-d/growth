import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "playground",
  position: 7,
  style: "kinesthetic",
  transcript:
    "A tree with 62 at the root. 31 is on its left, with children 15 and 47. 80 is on its right, with children 73 and 90. Tap the first node in pre-order. The answer is 62, 31, 15, 47, 80, 73, 90.",
  body: {
    startingKeys: [62, 31, 80, 15, 47, 73, 90],
    allowedOperations: ["traverse"],
    instructions: "Tap the first node in pre-order.",
    goal: {
      kind: "traversal",
      order: "preorder",
      keys: [62, 31, 15, 47, 80, 73, 90],
    },
  },
} satisfies BlockContent;
