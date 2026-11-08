import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "diagram",
  position: 3,
  transcript:
    "A tree with 8 at the root. 4 is on its left, with children 2 and 6. 12 is on its right, with children 10 and 14. The root, 8, is visited first. Then its left subtree: 4, 2 and 6. Then its right subtree: 12, 10 and 14. In pre-order the tree reads 8, 4, 2, 6, 12, 10, 14.",
  body: {
    startingKeys: [8, 4, 12, 2, 6, 10, 14],
    highlights: [{ key: 8, state: "active" }],
    caption: "Pre-order: 8, then the left subtree 4, 2, 6, then the right subtree 12, 10, 14.",
  },
} satisfies BlockContent;
