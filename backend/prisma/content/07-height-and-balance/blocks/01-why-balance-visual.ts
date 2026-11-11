import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "diagram",
  position: 1,
  style: "visual",
  transcript:
    "An AVL tree after the same idea of inserts, but with rebalancing. 40 is at the root. 20 is on its left, with children 10 and 30. 60 is on its right, with children 50 and 70. The tree is balanced, not a stick. Search never walks more than a few nodes.",
  body: {
    startingKeys: [40, 20, 60, 10, 30, 50, 70],
    highlights: [],
    caption:
      "AVL keeps the tree balanced. Same seven keys, but search stays O(log n) because no side runs away as a stick.",
  },
} satisfies BlockContent;
