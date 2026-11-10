import type { WrittenQuestionContent } from "@/infrastructure/course-content/content/content-schema";

export default [
  {
    key: "tap-in-post-order",
    type: "order_nodes",
    difficulty: 2,
    bloomsLevel: "apply",
    prompt: "Tap the nodes of this tree in post-order.",
    explanation:
      "Post-order visits the left subtree, then the right subtree, then the node. That gives 2, 6, 4, then 10, 14, 12, and 8 last.",
    reviewLesson: "post-order",
    hints: [
      "The root comes last.",
      "4 comes after both 2 and 6.",
      "The left subtree gives 2, 6, 4.",
    ],
    tree: "8,4,2,#,#,6,#,#,12,10,#,#,14,#,#",
    answer: { type: "order_nodes", keys: [2, 6, 4, 10, 14, 12, 8] },
  },
  {
    key: "root-last",
    type: "multiple_choice",
    difficulty: 1,
    bloomsLevel: "remember",
    prompt: "Which order visits 8, the root, last?",
    explanation:
      "Post-order visits a node after both of its subtrees, so the root is always last. Pre-order visits it first, and in-order visits it in the middle.",
    reviewLesson: "post-order",
    hints: ["Use the rule, not the picture.", "Which order visits a node after both subtrees?"],
    tree: "8,4,2,#,#,6,#,#,12,10,#,#,14,#,#",
    options: [
      { key: "pre-order", text: "Pre-order", isCorrect: false },
      { key: "in-order", text: "In-order", isCorrect: false },
      { key: "post-order", text: "Post-order", isCorrect: true },
    ],
  },
  {
    key: "why-delete-children-first",
    type: "multiple_choice",
    difficulty: 2,
    bloomsLevel: "understand",
    prompt: "Why do we delete a whole tree in post-order?",
    explanation:
      "A parent holds the only way to reach its children. Post-order deletes both subtrees before the node, so nothing is lost.",
    reviewLesson: "post-order",
    hints: ["How do you reach a child?", "What happens to the children if the parent goes first?"],
    options: [
      {
        key: "children-first",
        text: "Deleting a parent first loses the way to reach its children",
        isCorrect: true,
      },
      { key: "sorted", text: "Post-order deletes the keys in sorted order", isCorrect: false },
      { key: "root-first", text: "The root has to be deleted first", isCorrect: false },
      { key: "fewer-steps", text: "Post-order deletes fewer nodes", isCorrect: false },
    ],
  },
  {
    key: "postfix-form",
    type: "text",
    difficulty: 3,
    bloomsLevel: "apply",
    prompt:
      "An expression tree has + at the root. Its left child is × with 2 and 3 below it, and its right child is 4. Write it in postfix, with a space between each part.",
    explanation:
      "Post-order visits the left subtree 2 3 ×, then 4, then the root +. So the postfix form is 2 3 × 4 +.",
    reviewLesson: "post-order",
    hints: ["Each operator comes after its two values.", "The root, +, comes last."],
    accepted: [
      { key: "times-sign", text: "2 3 × 4 +" },
      { key: "asterisk", text: "2 3 * 4 +" },
    ],
  },
  {
    key: "postfix-of-subtraction",
    type: "multiple_choice",
    difficulty: 3,
    bloomsLevel: "apply",
    prompt:
      "An expression tree for 7 − 2 × 3 has − at the root, 7 on its left, and × with 2 and 3 on its right. What is its postfix form?",
    explanation:
      "Post-order visits 7, then the right subtree 2 3 ×, then the root −. So the postfix form is 7 2 3 × −.",
    reviewLesson: "post-order",
    hints: ["The root, −, comes last.", "The right subtree gives 2 3 ×."],
    options: [
      { key: "post-order", text: "7 2 3 × −", isCorrect: true },
      { key: "pre-order", text: "− 7 × 2 3", isCorrect: false },
      { key: "in-order", text: "7 − 2 × 3", isCorrect: false },
      { key: "wrong-order", text: "7 2 − 3 ×", isCorrect: false },
    ],
  },
] satisfies WrittenQuestionContent[];
