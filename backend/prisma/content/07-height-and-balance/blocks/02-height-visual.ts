import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "diagram",
  position: 2,
  style: "visual",
  transcript:
    "The same tree drawn as a diagram. The longest way down is highlighted: 20, then 10, then 5. That is three nodes, so the height of the tree is 3. The other heights are 5 is 1, 30 is 1 and 10 is 2.",
  body: {
    startingKeys: [20, 10, 30, 5],
    highlights: [
      { key: 20, state: "active" },
      { key: 10, state: "active" },
      { key: 5, state: "active" },
    ],
    caption:
      "Recap: the longest way down is 20 → 10 → 5. That is 3 nodes, so the height is 3. Heights: 5 → 1, 30 → 1, 10 → 2, 20 → 3.",
  },
} satisfies BlockContent;
