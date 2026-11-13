import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "diagram",
  position: 4,
  style: "visual",
  transcript:
    "After the left rotation: 20 moved up, 10 is its left child. 20 is the child that moved up. Balance factor is 1 minus 1, which is 0. 10 is the unbalanced node, the question's pivot. Balance factor is 0 minus 0, which is 0. 30 has balance factor 0.",
  body: {
    startingKeys: [20, 10, 30],
    highlights: [
      { key: 20, state: "rotating" },
      { key: 10, state: "rotating" },
    ],
    caption: "After the left rotation: 20 moved up, 10 is its left child.",
    labels: [
      { text: ["20: the child that moved up", "BF = 1 − 1 = 0"], keys: [20], place: "side" },
      {
        text: ["10: the unbalanced node (the question's pivot)", "BF = 0 − 0 = 0"],
        keys: [10],
        place: "side",
      },
      { text: ["30: BF = 0"], keys: [30], place: "side" },
    ],
  },
} satisfies BlockContent;
