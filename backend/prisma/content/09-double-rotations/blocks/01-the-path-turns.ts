import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "diagram",
  position: 1,
  transcript:
    "The path turns. 30 is at the top, 10 is on its left, and 20 is on the right of 10. 30 is unbalanced, with balance factor plus 2. 10 has balance factor minus 1. In lesson 8 the path from the unbalanced node down to the new key was straight: left, then left. Here 20 went left at 30, then right at 10. The path turns. This is the left-right case. The unbalanced node is heavy on its left, and its left child is heavy on its right.",
  body: {
    startingKeys: [30, 10, 20],
    treeMode: "bst",
    highlights: [{ key: 30, state: "unbalanced" }],
    caption: "From 30 the path goes left, then right.",
    labels: [
      { text: ["Balance factor +2", "heavy on the left"], keys: [30], place: "right" },
      { text: ["Balance factor −1", "heavy on the right"], keys: [10], place: "side" },
    ],
    markdown:
      "## The path turns\n\nIn lesson 8 the path from the unbalanced node down to the new key was straight: left, then left.\n\nHere `20` went **left** at `30`, then **right** at `10`. The path turns.\n\nThis is the **left-right case**. The unbalanced node is heavy on its left, and its **left child** is heavy on its right.",
    terms: { "left-right case": [30, 10, 20], "left child": [10] },
  },
} satisfies BlockContent;
