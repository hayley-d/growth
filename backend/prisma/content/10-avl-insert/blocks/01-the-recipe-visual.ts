import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "diagram",
  position: 1,
  style: "visual",
  transcript:
    "A tree with 30 at the root. 20 is on its left, with 10 as its left child. 40 is on its right. The path for inserting 5 is highlighted: 30, then 20, then 10. Part one goes down this path. Part two comes back up the same path, updating heights. Part three fixes the first node on the way up whose balance factor is minus 2 or 2.",
  body: {
    startingKeys: [30, 20, 40, 10],
    highlights: [
      { key: 30, state: "active" },
      { key: 20, state: "active" },
      { key: 10, state: "active" },
    ],
    caption:
      "The path for inserting 5 is 30 → 20 → 10. Go down it, come back up it updating heights, and fix the first node whose balance factor is -2 or 2.",
    labels: [
      { text: ["1. Go down"], keys: [30], place: "side" },
      { text: ["2. Walk back up"], keys: [10], place: "side" },
      { text: ["3. Fix the first problem"], keys: [20], place: "side" },
    ],
  },
} satisfies BlockContent;
