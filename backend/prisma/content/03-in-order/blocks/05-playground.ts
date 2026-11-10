import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "playground",
  position: 5,
  transcript:
    "A tree with 36 at the root. 18 is on its left, with 9 below it. 64 is on its right, with children 52 and 71. Tap the nodes in in-order. The answer is 9, 18, 36, 52, 64, 71.",
  body: {
    startingKeys: [36, 18, 64, 9, 52, 71],
    allowedOperations: ["traverse"],
    instructions: "Tap the nodes in in-order.",
    goal: { kind: "traversal", order: "inorder", keys: [9, 18, 36, 52, 64, 71] },
  },
} satisfies BlockContent;
