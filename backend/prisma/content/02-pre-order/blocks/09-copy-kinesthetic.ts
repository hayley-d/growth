import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "playground",
  position: 9,
  style: "kinesthetic",
  transcript:
    "A tree with 44 at the root. 22 is on its left, with children 11 and 33. 66 is on its right, with children 55 and 77. Tap the nodes in the order you'd copy them. The answer is 44, 22, 11, 33, 66, 55, 77.",
  body: {
    startingKeys: [44, 22, 66, 11, 33, 55, 77],
    allowedOperations: ["traverse"],
    instructions: "Tap the nodes in the order you'd copy them.",
    goal: {
      kind: "traversal",
      order: "preorder",
      keys: [44, 22, 11, 33, 66, 55, 77],
    },
  },
} satisfies BlockContent;
