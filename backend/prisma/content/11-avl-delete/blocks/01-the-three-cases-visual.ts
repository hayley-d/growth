import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "diagram",
  position: 1,
  style: "visual",
  transcript:
    "A tree with 50 at the root. 30 is on its left, with 20 and 40 as its children. 70 is on its right, with 60 as its only child. Three nodes are marked. 20 is a leaf, so it is just removed. 70 has one child, 60, which takes its place. 50 has two children, so it is replaced by its in-order successor, the smallest key in its right subtree.",
  body: {
    startingKeys: [50, 30, 70, 20, 40, 60],
    highlights: [
      { key: 20, state: "deleting" },
      { key: 70, state: "deleting" },
      { key: 50, state: "deleting" },
    ],
    caption:
      "Three nodes you could delete. 20 is a leaf: remove it. 70 has one child: the child takes its place. 50 has two children: the in-order successor takes its place.",
    labels: [
      { text: ["50: two children"], keys: [50], place: "side" },
      { text: ["70: one child"], keys: [70], place: "side" },
      { text: ["20: leaf"], keys: [20], place: "side" },
    ],
  },
} satisfies BlockContent;
