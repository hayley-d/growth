import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "diagram",
  position: 1,
  style: "visual",
  transcript:
    "After the right rotation: 20 moved up, 30 is its right child. 20 is the child that moved up. Balance factor is 1 minus 1, which is 0. 30 is the unbalanced node, the question's pivot. Balance factor is 0 minus 0, which is 0. 10 has balance factor 0.",
  body: {
    startingKeys: [20, 10, 30],
    highlights: [
      { key: 20, state: "rotating" },
      { key: 30, state: "rotating" },
    ],
    caption: "After the right rotation: 20 moved up, 30 is its right child.",
    labels: [
      { text: ["20: the child that moved up", "BF = 1 − 1 = 0"], keys: [20], place: "side" },
      {
        text: ["30: the unbalanced node (the question's pivot)", "BF = 0 − 0 = 0"],
        keys: [30],
        place: "side",
      },
      { text: ["10: BF = 0"], keys: [10], place: "side" },
    ],
  },
} satisfies BlockContent;
