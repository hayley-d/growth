import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "diagram",
  position: 2,
  style: "visual",
  transcript:
    "A tree with 8 at the root. 4 is on its left, with children 2 and 6. 12 is on its right, with children 10 and 14. Two subtrees hang off 8: 4, 2 and 6 on the left, 12, 10 and 14 on the right.",
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
        state: "new",
      },
      {
        key: 10,
        state: "new",
      },
      {
        key: 14,
        state: "new",
      },
    ],
    caption: "Two subtrees hang off 8: 4, 2 and 6 on the left, 12, 10 and 14 on the right.",
  },
} satisfies BlockContent;
