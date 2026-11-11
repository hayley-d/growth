import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "playground",
  position: 1,
  style: "kinesthetic",
  transcript:
    "A tree with 20 at the root. 10 is on its left, with children 5 and 15. 30 is on its right. Use the rule: tap one row at a time, from left to right. The answer is 20, 10, 30, 5, 15.",
  body: {
    startingKeys: [20, 10, 30, 5, 15],
    allowedOperations: ["traverse"],
    instructions: "Use the rule: tap one row at a time, from left to right.",
    goal: {
      kind: "traversal",
      order: "levelorder",
      keys: [20, 10, 30, 5, 15],
    },
  },
} satisfies BlockContent;
