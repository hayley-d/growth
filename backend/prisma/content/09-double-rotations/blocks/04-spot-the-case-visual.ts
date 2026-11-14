import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "diagram",
  position: 4,
  style: "visual",
  transcript:
    "Opposite signs. 10 is at the top, 30 is on its right, and 20 is on the left of 30. 10 is unbalanced with balance factor minus 2. Its taller child, 30, has balance factor plus 1. The signs are opposite, so the path turns: right, then left. This is the right-left case, and it needs two rotations.",
  body: {
    startingKeys: [10, 30, 20],
    treeMode: "bst",
    highlights: [{ key: 10, state: "unbalanced" }],
    caption: "−2 and +1 are opposite signs: the path turns, so two rotations.",
    labels: [
      { text: ["Balance factor −2"], keys: [10], place: "side" },
      { text: ["Balance factor +1", "opposite sign"], keys: [30], place: "right" },
    ],
  },
} satisfies BlockContent;
