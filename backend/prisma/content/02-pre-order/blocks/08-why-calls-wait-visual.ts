import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "diagram",
  position: 8,
  style: "visual",
  transcript:
    "A tree with 20 at the root. 10 is on its left. 30 is on its right. preorder(20) has visited 20. It waits at line 4 while preorder(10) runs.",
  body: {
    startingKeys: [20, 10, 30],
    highlights: [
      {
        key: 20,
        state: "visited",
      },
      {
        key: 10,
        state: "active",
      },
    ],
    caption: "preorder(20) has visited 20. It waits at line 4 while preorder(10) runs.",
  },
} satisfies BlockContent;
