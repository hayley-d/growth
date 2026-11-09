import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "diagram",
  position: 2,
  style: "visual",
  transcript:
    "A tree with 8 at the root. 4 is on its left, with children 2 and 6. 12 is on its right, with children 10 and 14. Visit 8 first. Then the same three steps run on the subtrees under 4 and 12.",
  body: {
    startingKeys: [8, 4, 12, 2, 6, 10, 14],
    highlights: [
      {
        key: 8,
        state: "active",
      },
      {
        key: 4,
        state: "new",
      },
      {
        key: 12,
        state: "new",
      },
    ],
    caption: "Visit 8 first. Then the same three steps run on the subtrees under 4 and 12.",
  },
} satisfies BlockContent;
