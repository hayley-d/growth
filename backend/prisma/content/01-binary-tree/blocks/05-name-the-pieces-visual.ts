import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "diagram",
  position: 5,
  style: "visual",
  transcript:
    "The tree you built, with 8 at the root, 4 on its left and 12 on its right. 4 has children 2 and 6. 12 has children 10 and 14. The four leaves, 2, 6, 10 and 14, are highlighted.",
  body: {
    startingKeys: [8, 4, 12, 2, 6, 10, 14],
    highlights: [
      { key: 8, state: "new" },
      { key: 2, state: "active" },
      { key: 6, state: "active" },
      { key: 10, state: "active" },
      { key: 14, state: "active" },
    ],
    caption: "8 is the root. The four leaves are highlighted.",
    labels: [
      { text: ["8 is the root"], keys: [8], place: "right" },
      { text: ["The four leaves:", "2, 6, 10 and 14"], keys: [2, 6, 10, 14], place: "below" },
    ],
  },
} satisfies BlockContent;
