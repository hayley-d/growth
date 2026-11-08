import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "number_line",
  position: 6,
  transcript:
    "The tree with 8 at the root is read in in-order. Each key lands in the next box on a number line: 2, 4, 6, 8, 10, 12, 14. Each key is bigger than the one before it, so the line ends up sorted.",
  body: {
    startingKeys: [8, 4, 12, 2, 6, 10, 14],
    caption: "Each key lands to the right of the one before it.",
  },
} satisfies BlockContent;
