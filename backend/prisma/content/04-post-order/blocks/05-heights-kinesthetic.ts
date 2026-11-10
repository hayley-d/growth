import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "playground",
  position: 5,
  style: "kinesthetic",
  transcript:
    "A tree with 40 at the root. 25 is on its left, with children 10 and 30. 60 is on its right, with 55 below it. Tap the nodes in the order you'd work out their heights. The answer is 10, 30, 25, 55, 60, 40.",
  body: {
    startingKeys: [40, 25, 60, 10, 30, 55],
    allowedOperations: ["traverse"],
    instructions: "Tap the nodes in the order you'd work out their heights.",
    goal: {
      kind: "traversal",
      order: "postorder",
      keys: [10, 30, 25, 55, 60, 40],
    },
  },
} satisfies BlockContent;
