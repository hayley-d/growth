import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "playground",
  position: 4,
  style: "kinesthetic",
  transcript:
    "A tree with 56 at the root. 27 is on its left, with children 12 and 39. 83 is on its right, with children 68 and 95. Tap the nodes in the order you'd delete them. The answer is 12, 39, 27, 68, 95, 83, 56.",
  body: {
    startingKeys: [56, 27, 83, 12, 39, 68, 95],
    allowedOperations: ["traverse"],
    instructions: "Tap the nodes in the order you'd delete them.",
    goal: {
      kind: "traversal",
      order: "postorder",
      keys: [12, 39, 27, 68, 95, 83, 56],
    },
  },
} satisfies BlockContent;
