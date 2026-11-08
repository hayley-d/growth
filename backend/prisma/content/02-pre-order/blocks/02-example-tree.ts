import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "diagram",
  position: 2,
  transcript:
    "A tree with 8 at the root. 4 is on its left, with children 2 and 6. 12 is on its right, with children 10 and 14.",
  body: {
    startingKeys: [8, 4, 12, 2, 6, 10, 14],
    highlights: [],
    caption: "The tree we use in this lesson.",
  },
} satisfies BlockContent;
