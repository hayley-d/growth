import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "diagram",
  position: 2,
  style: "visual",
  transcript:
    "The same tree drawn as a diagram. 20 is at the root, 10 on the left with child 5, and 30 on the right. Node 20 is highlighted as active. Read the heights in the caption: 5 is 1, 30 is 1, 10 is 2, 20 is 3.",
  body: {
    startingKeys: [20, 10, 30, 5],
    highlights: [{ key: 20, state: "active" }],
    caption: "Heights: 5 → 1, 30 → 1, 10 → 2, 20 → 3. The tree's height is 3.",
  },
} satisfies BlockContent;
