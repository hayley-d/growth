import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "copy_tree",
  position: 12,
  transcript:
    "The tree is copied one node at a time, in pre-order: 8, 4, 2, 6, 12, 10, 14. Each node is added under its parent, which is already in the copy.",
  body: {
    startingKeys: [8, 4, 12, 2, 6, 10, 14],
    caption: "Each node goes into the copy after its parent.",
  },
} satisfies BlockContent;
