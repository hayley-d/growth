import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "playground",
  position: 7,
  transcript:
    "A tree with 50 at the root. 30 is on its left, with children 20 and 40. 70 is on its right. Insert 10. If a node leans too far left, rotate it right. After a right rotation at 50, 30 is the root, with 20 and 10 on the left and 50, 40 and 70 on the right. Pre-order is 30, 20, 10, 50, 40, 70.",
  body: {
    startingKeys: [50, 30, 70, 20, 40],
    allowedOperations: ["insert", "rotateLeft", "rotateRight"],
    instructions:
      "Insert 10. If a node leans too far left, rotate it right. Check the balance factors after.",
    goal: { kind: "traversal", order: "preorder", keys: [30, 20, 10, 50, 40, 70] },
  },
} satisfies BlockContent;
