import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "playground",
  position: 4,
  style: "kinesthetic",
  transcript:
    "A tree with 44 at the root. 22 is on its left, with children 11 and 33. 66 is on its right, with children 55 and 77. Tap the keys from smallest to biggest. That's the in-order. The answer is 11, 22, 33, 44, 55, 66, 77.",
  body: {
    startingKeys: [44, 22, 66, 11, 33, 55, 77],
    allowedOperations: ["traverse"],
    instructions: "Tap the keys from smallest to biggest. That's the in-order.",
    goal: {
      kind: "traversal",
      order: "inorder",
      keys: [11, 22, 33, 44, 55, 66, 77],
    },
  },
} satisfies BlockContent;
