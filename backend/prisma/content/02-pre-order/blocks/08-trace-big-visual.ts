import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "diagram",
  position: 8,
  style: "visual",
  transcript:
    "A tree with 8 at the root. 4 is on its left, with children 2 and 6. 12 is on its right, with children 10 and 14. Before the code reaches 12, preorder(4) has to finish 2 and 6.",
  body: {
    startingKeys: [8, 4, 12, 2, 6, 10, 14],
    highlights: [
      {
        key: 8,
        state: "visited",
      },
      {
        key: 4,
        state: "active",
      },
      {
        key: 2,
        state: "new",
      },
      {
        key: 6,
        state: "new",
      },
    ],
    caption: "Before the code reaches 12, preorder(4) has to finish 2 and 6.",
  },
} satisfies BlockContent;
