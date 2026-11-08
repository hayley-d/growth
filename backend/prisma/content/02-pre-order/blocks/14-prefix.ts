import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "expression_tree",
  position: 14,
  transcript:
    "An expression tree with plus at the root. Its left child is times, with 2 and 3 below it. Its right child is 4. Stepping through it in pre-order gives plus, times, 2, 3, 4.",
  body: {
    expression: {
      operator: "+",
      left: { operator: "×", left: { value: 2 }, right: { value: 3 } },
      right: { value: 4 },
    },
    order: "preorder",
    caption: "2 × 3 + 4 in pre-order is + × 2 3 4.",
  },
} satisfies BlockContent;
