import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "diagram",
  position: 7,
  style: "visual",
  transcript:
    "A tree with 8 at the root. 4 is on its left, with children 2 and 6. 12 is on its right, with children 10 and 14. 8, then 4, 2, 6, then 12, 10, 14. Each subtree is a block of keys in a row.",
  body: {
    startingKeys: [8, 4, 12, 2, 6, 10, 14],
    highlights: [
      {
        key: 8,
        state: "active",
      },
      {
        key: 4,
        state: "visited",
      },
      {
        key: 2,
        state: "visited",
      },
      {
        key: 6,
        state: "visited",
      },
      {
        key: 12,
        state: "visited",
      },
      {
        key: 10,
        state: "visited",
      },
      {
        key: 14,
        state: "visited",
      },
    ],
    caption: "8, then 4, 2, 6, then 12, 10, 14. Each subtree is a block of keys in a row.",
  },
} satisfies BlockContent;
