import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "playground",
  position: 16,
  transcript:
    "A tree with 28 at the root. 21 is on its left, with 1 below it. 57 is on its right, with children 47 and 59. Tap the nodes in pre-order. The answer is 28, 21, 1, 57, 47, 59.",
  body: {
    startingKeys: [28, 21, 57, 1, 47, 59],
    allowedOperations: ["traverse"],
    instructions: "Tap the first node in pre-order.",
    goal: { kind: "traversal", order: "preorder", keys: [28, 21, 1, 57, 47, 59] },
  },
} satisfies BlockContent;
