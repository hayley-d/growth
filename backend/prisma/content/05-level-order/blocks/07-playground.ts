import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "playground",
  position: 7,
  transcript:
    "A tree with 42 at the root. 26 is on its left, with 13 below it. 75 is on its right, with children 61 and 88. Tap the nodes in level-order. The answer is 42, 26, 75, 13, 61, 88.",
  body: {
    startingKeys: [42, 26, 75, 13, 61, 88],
    allowedOperations: ["traverse"],
    instructions: "Tap the nodes in level-order.",
    goal: { kind: "traversal", order: "levelorder", keys: [42, 26, 75, 13, 61, 88] },
  },
} satisfies BlockContent;
