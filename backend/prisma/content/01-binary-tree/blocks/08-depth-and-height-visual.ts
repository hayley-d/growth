import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "diagram",
  position: 8,
  style: "visual",
  transcript:
    "The same tree with one path from the root to a leaf highlighted: 8, then 12, then 14. Every path from the root to a leaf in this tree has three nodes, so the height of the tree is 3. 14 is two edges below the root, so its depth is 2.",
  body: {
    startingKeys: [8, 4, 12, 2, 6, 10, 14],
    highlights: [
      { key: 8, state: "active" },
      { key: 12, state: "active" },
      { key: 14, state: "active" },
    ],
    caption: "Every path from the root to a leaf has 3 nodes, so the height is 3.",
  },
} satisfies BlockContent;
