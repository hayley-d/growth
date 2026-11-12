import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "diagram",
  position: 2,
  style: "visual",
  transcript:
    "After the right rotation at 40: 20 moved up, and 30 moved across to the left of 40. 20 moved up. Balance factor is 2 minus 2, which is 0. 40 was unbalanced, now balance factor is 1 minus 1, which is 0. 30 is the inner subtree, moved from 20's right to 40's left.",
  body: {
    startingKeys: [20, 10, 40, 5, 30, 50],
    highlights: [
      { key: 20, state: "rotating" },
      { key: 40, state: "rotating" },
      { key: 30, state: "active" },
    ],
    caption: "After the right rotation at 40: 20 moved up, and 30 moved across to the left of 40.",
    labels: [
      { text: ["20: moved up", "BF = 2 − 2 = 0"], keys: [20], place: "side" },
      { text: ["40: was unbalanced, now BF = 1 − 1 = 0"], keys: [40], place: "side" },
      {
        text: ["30: the inner subtree, moved from 20's right to 40's left"],
        keys: [30],
        place: "side",
      },
    ],
  },
} satisfies BlockContent;
