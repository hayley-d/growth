import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "diagram",
  position: 8,
  style: "visual",
  transcript:
    "A tree with 8 at the root. 4 is on its left, with children 2 and 6. 12 is on its right, with children 10 and 14. The copy so far: 8, 4 and 2. Each one went in after its parent.",
  body: {
    startingKeys: [8, 4, 12, 2, 6, 10, 14],
    highlights: [
      {
        key: 8,
        state: "new",
      },
      {
        key: 4,
        state: "new",
      },
      {
        key: 2,
        state: "new",
      },
    ],
    caption: "The copy so far: 8, 4 and 2. Each one went in after its parent.",
  },
} satisfies BlockContent;
