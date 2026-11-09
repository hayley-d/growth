import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "playground",
  position: 6,
  style: "kinesthetic",
  transcript:
    "A tree with 8 at the root. 4 is on its left, with children 2 and 6. 12 is on its right, with children 10 and 14. Before you watch the trace, tap the nodes in pre-order yourself. The answer is 8, 4, 2, 6, 12, 10, 14.",
  body: {
    startingKeys: [8, 4, 12, 2, 6, 10, 14],
    allowedOperations: ["traverse"],
    instructions: "Before you watch the trace, tap the nodes in pre-order yourself.",
    goal: {
      kind: "traversal",
      order: "preorder",
      keys: [8, 4, 2, 6, 12, 10, 14],
    },
  },
} satisfies BlockContent;
