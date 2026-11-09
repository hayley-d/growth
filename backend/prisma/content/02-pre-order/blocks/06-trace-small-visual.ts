import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "diagram",
  position: 6,
  style: "visual",
  transcript:
    "A tree with 20 at the root. 10 is on its left. 30 is on its right. All done: 20 first, then 10, then 30.",
  body: {
    startingKeys: [20, 10, 30],
    highlights: [
      {
        key: 20,
        state: "visited",
      },
      {
        key: 10,
        state: "visited",
      },
      {
        key: 30,
        state: "visited",
      },
    ],
    caption: "All done: 20 first, then 10, then 30.",
  },
} satisfies BlockContent;
