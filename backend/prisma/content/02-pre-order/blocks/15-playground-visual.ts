import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "diagram",
  position: 15,
  style: "visual",
  transcript:
    "A tree with 28 at the root. 21 is on its left, with 1 below it. 57 is on its right, with children 47 and 59. After 28, 21 and 1, the left side is done. The next tap is 57.",
  body: {
    startingKeys: [28, 21, 57, 1, 47, 59],
    highlights: [
      {
        key: 28,
        state: "visited",
      },
      {
        key: 21,
        state: "visited",
      },
      {
        key: 1,
        state: "visited",
      },
      {
        key: 57,
        state: "active",
      },
    ],
    caption: "After 28, 21 and 1, the left side is done. The next tap is 57.",
  },
} satisfies BlockContent;
