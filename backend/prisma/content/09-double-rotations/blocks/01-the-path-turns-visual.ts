import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "diagram",
  position: 1,
  style: "visual",
  transcript:
    "Compare with lesson 8. 30 is at the top, 20 is on its left, and 10 is on the left of 20. The path from 30 goes left, then left. It is straight. This is the left-left case, which one right rotation fixes. In the left-right case the path turns instead.",
  body: {
    startingKeys: [30, 20, 10],
    treeMode: "bst",
    highlights: [{ key: 30, state: "unbalanced" }],
    caption: "Lesson 8's left-left case: the path goes left, then left. It is straight.",
    labels: [
      { text: ["Balance factor +2"], keys: [30], place: "right" },
      { text: ["Balance factor +1"], keys: [20], place: "right" },
    ],
  },
} satisfies BlockContent;
