import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "diagram",
  position: 3,
  style: "visual",
  transcript:
    "The same tree again. Node 20 is highlighted as active while we work out its balance factor. Left height is 2, right height is 1, so balance factor is 1. The labels also give 10 as 1, and the leaves 5 and 30 as 0.",
  body: {
    startingKeys: [20, 10, 30, 5],
    highlights: [{ key: 20, state: "active" }],
    caption: "BF of 20: left height 2 − right height 1 = 1. Also: 10 → 1, 5 → 0, 30 → 0.",
    labels: [
      { text: ["20: BF = 2 − 1 = 1"], keys: [20], place: "side" },
      { text: ["10: BF = 1 − 0 = 1", "30: BF = 0 − 0 = 0"], keys: [30], place: "side" },
      { text: ["5: BF = 0 − 0 = 0"], keys: [5], place: "side" },
    ],
  },
} satisfies BlockContent;
