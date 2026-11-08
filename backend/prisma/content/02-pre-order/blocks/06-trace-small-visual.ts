import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "diagram",
  position: 6,
  style: "visual",
  transcript:
    "A tree with 20 at the root. 10 is on its left. 30 is on its right. The trace starts at 20. Watch it light up first.",
  body: {
    startingKeys: [20, 10, 30],
    highlights: [
      {
        key: 20,
        state: "active",
      },
    ],
    caption: "The trace starts at 20. Watch it light up first.",
  },
} satisfies BlockContent;
