import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "diagram",
  position: 3,
  style: "visual",
  transcript:
    "The tree between the two rotations. After the first rotation, the left rotation at 10, the tree is 30 at the top, 20 on its left, and 10 on the left of 20. 20 is highlighted. The path is straight now: left, then left. This is the left-left case, so the second rotation, a right rotation at 30, fixes it.",
  body: {
    startingKeys: [30, 20, 10],
    treeMode: "bst",
    highlights: [{ key: 20, state: "rotating" }],
    caption: "After the first rotation: the path is straight, so it is now left-left.",
    labels: [
      { text: ["Next: rotate right here"], keys: [30], place: "right" },
      { text: ["Moved up once"], keys: [20], place: "side" },
    ],
  },
} satisfies BlockContent;
