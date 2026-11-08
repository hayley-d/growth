import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "diagram",
  position: 14,
  style: "visual",
  transcript:
    "A tree with 28 at the root. 21 is on its left, with 1 below it. 57 is on its right, with children 47 and 59. Start here. The root, 28, is always first in pre-order.",
  body: {
    startingKeys: [28, 21, 57, 1, 47, 59],
    highlights: [
      {
        key: 28,
        state: "active",
      },
    ],
    caption: "Start here. The root, 28, is always first in pre-order.",
  },
} satisfies BlockContent;
