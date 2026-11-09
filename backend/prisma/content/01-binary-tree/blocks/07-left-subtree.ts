import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "diagram",
  position: 7,
  transcript:
    "The same tree with the left subtree of 8 highlighted. The highlighted nodes are 4, 2 and 6. All of them are smaller than 8.",
  body: {
    startingKeys: [8, 4, 12, 2, 6, 10, 14],
    highlights: [
      { key: 8, state: "new" },
      { key: 4, state: "active" },
      { key: 2, state: "active" },
      { key: 6, state: "active" },
    ],
    caption: "Everything in the left subtree of 8 is smaller than 8.",
  },
} satisfies BlockContent;
