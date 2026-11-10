import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "expression_tree",
  position: 6,
  transcript:
    "Postfix expressions. Postfix notation is a notation where the operator comes after its two values. For example 2 times 3 plus 4 would look like 2, 3, times, 4, plus in postfix notation. Post-order traversal enables you to read an expression tree to produce the postfix notation of the tree. An expression tree with plus at the root. Its left child is times, with 2 and 3 below it. Its right child is 4. Stepping through it in post-order gives 2, 3, times, 4, plus.",
  body: {
    expression: {
      operator: "+",
      left: { operator: "×", left: { value: 2 }, right: { value: 3 } },
      right: { value: 4 },
    },
    order: "postorder",
    caption: "2 × 3 + 4 in post-order is 2 3 × 4 +.",
    markdown:
      "## Postfix expressions\n\nPostfix notation is a notation where the operator comes after its two values. For example 2 × 3 + 4 would look like 2 3 × 4 + in postfix notation. Post-order traversal enables you to read an expression tree to produce the postfix notation of the tree.",
  },
} satisfies BlockContent;
