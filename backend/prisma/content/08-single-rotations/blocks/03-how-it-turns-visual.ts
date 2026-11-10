import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "diagram",
  position: 3,
  style: "visual",
  transcript:
    "After a right rotation, 20 is at the root, with 10 on its left and 30 on its right. 20 and 30 are highlighted. 20 moved up, and 30 is now its right child.",
  body: {
    startingKeys: [20, 10, 30],
    highlights: [
      { key: 20, state: "rotating" },
      { key: 30, state: "rotating" },
    ],
    caption: "20 moved up. 30 is now its right child.",
  },
} satisfies BlockContent;
