import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "diagram",
  position: 8,
  transcript:
    "A tree with 4 at the root, 2 and 6 below it, and 1, 3, 5 and 7 as leaves. Read in in-order, it gives 1, 2, 3, 4, 5, 6, 7. That is the same order as the nodes from left to right across the page.",
  body: {
    startingKeys: [4, 2, 6, 1, 3, 5, 7],
    highlights: [],
    caption: "Numbers show the in-order. Left to right across the page is the same order.",
  },
} satisfies BlockContent;
