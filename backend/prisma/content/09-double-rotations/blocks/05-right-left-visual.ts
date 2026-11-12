import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "diagram",
  position: 5,
  style: "visual",
  transcript:
    "The tree between the two rotations. After the right rotation at 30, the tree is 10 at the top, 20 on its right, and 30 on the right of 20. The path is straight: right, then right. This is the right-right case, so a left rotation at 10 fixes it.",
  body: {
    startingKeys: [10, 20, 30],
    treeMode: "bst",
    highlights: [{ key: 20, state: "rotating" }],
    caption: "After the first rotation: the path is straight, so it is now right-right.",
    labels: [
      { text: ["Next: rotate left here"], keys: [10], place: "side" },
      { text: ["Moved up once"], keys: [20], place: "right" },
    ],
  },
} satisfies BlockContent;
