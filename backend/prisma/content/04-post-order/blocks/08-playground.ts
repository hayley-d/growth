import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "playground",
  position: 8,
  transcript:
    "A tree with 42 at the root. 26 is on its left, with 13 below it. 75 is on its right, with children 61 and 88. Tap the nodes in post-order. The answer is 13, 26, 61, 88, 75, 42.",
  body: {
    startingKeys: [42, 26, 75, 13, 61, 88],
    allowedOperations: ["traverse"],
    instructions: "Tap the nodes in post-order.",
    goal: { kind: "traversal", order: "postorder", keys: [13, 26, 61, 88, 75, 42] },
  },
} satisfies BlockContent;
