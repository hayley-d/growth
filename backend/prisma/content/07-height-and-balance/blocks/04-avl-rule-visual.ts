import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "diagram",
  position: 4,
  style: "visual",
  transcript:
    "A valid AVL tree with 40 at the root, 20 and 60 as children, and leaves 10, 30, 50 and 70. Every balance factor is 0. The caption lists them. This is what the AVL rule looks like when it holds.",
  body: {
    startingKeys: [40, 20, 60, 10, 30, 50, 70],
    highlights: [],
    caption:
      "Valid AVL: every BF is 0. Listed: 10,30,50,70 → 0; 20,60 → 0; 40 → 0. Compare with the stick in the text, where BF goes to −2 and −3.",
  },
} satisfies BlockContent;
