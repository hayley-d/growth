import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "diagram",
  position: 3,
  style: "visual",
  transcript:
    "A tree with 8 at the root. 4 is on its left, with children 2 and 6. 12 is on its right, with children 10 and 14. 8, 4, 2 and 6 are done. 12 is next, because the whole left subtree is finished.",
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
    caption: "8, 4, 2 and 6 are done. 12 is next, because the whole left subtree is finished.",
  },
} satisfies BlockContent;
