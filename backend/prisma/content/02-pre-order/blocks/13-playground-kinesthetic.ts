import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "playground",
  position: 13,
  style: "kinesthetic",
  transcript:
    "A tree with 35 at the root. 18 is on its left, with children 7 and 26. 52 is on its right, with children 44 and 61. One more tree. Tap the first node in pre-order. The answer is 35, 18, 7, 26, 52, 44, 61.",
  body: {
    startingKeys: [35, 18, 52, 7, 26, 44, 61],
    allowedOperations: ["traverse"],
    instructions: "One more tree. Tap the first node in pre-order.",
    goal: {
      kind: "traversal",
      order: "preorder",
      keys: [35, 18, 7, 26, 52, 44, 61],
    },
  },
} satisfies BlockContent;
