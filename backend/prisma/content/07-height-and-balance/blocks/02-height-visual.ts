import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "diagram",
  position: 2,
  style: "visual",
  transcript:
    "The same tree drawn as a diagram. The longest way down is highlighted: 20, then 10, then 5. That is three nodes, so the height of the tree is 3. The labels give each height: 20 has height 3, 10 has height 2, 30 has height 1 and 5 has height 1.",
  body: {
    startingKeys: [20, 10, 30, 5],
    highlights: [
      { key: 20, state: "active" },
      { key: 10, state: "active" },
      { key: 5, state: "active" },
    ],
    caption:
      "Recap: the longest way down is 20 → 10 → 5. That is 3 nodes, so the height is 3. Heights: 5 → 1, 30 → 1, 10 → 2, 20 → 3.",
    labels: [
      { text: ["20: height 3"], keys: [20], place: "side" },
      { text: ["10: height 2", "30: height 1"], keys: [30], place: "side" },
      { text: ["5: height 1"], keys: [5], place: "side" },
    ],
  },
} satisfies BlockContent;
