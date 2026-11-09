import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "expression_tree",
  position: 7,
  transcript:
    "Prefix expressions. Prefix notation is a notation where the operator comes before its two values. For example 2 times 3 plus 4 would look like plus, times, 2, 3, 4 in prefix notation. Pre-order traversal enables you to read an expression tree to produce the prefix notation of the tree. An expression tree with plus at the root. Its left child is times, with 2 and 3 below it. Its right child is 4. Stepping through it in pre-order gives plus, times, 2, 3, 4.",
  body: {
    expression: {
      operator: "+",
      left: { operator: "×", left: { value: 2 }, right: { value: 3 } },
      right: { value: 4 },
    },
    order: "preorder",
    caption: "2 × 3 + 4 in pre-order is + × 2 3 4.",
    markdown:
      "## Prefix expressions\n\nPrefix notation is a notation where the operator comes before its two values. For example 2 × 3 + 4 would look like + × 2 3 4 in prefix notation. Pre-order traversal enables you to read an expression tree to produce the prefix notation of the tree.",
  },
} satisfies BlockContent;
