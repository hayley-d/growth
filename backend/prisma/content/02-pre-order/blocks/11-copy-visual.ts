import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "diagram",
  position: 11,
  style: "visual",
  transcript:
    "A tree with 8 at the root. 4 is on its left, with children 2 and 6. 12 is on its right, with children 10 and 14. When 12 is copied, the left side of the copy is already complete.",
  body: {
    startingKeys: [8, 4, 12, 2, 6, 10, 14],
    highlights: [
      {
        key: 8,
        state: "visited",
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
        state: "active",
      },
    ],
    caption: "When 12 is copied, the left side of the copy is already complete.",
  },
} satisfies BlockContent;
