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
    key: "two-before-four",
    type: "multiple_choice",
    difficulty: 2,
    bloomsLevel: "analyse",
    prompt: "Which two orders visit 2 before 4 on this tree?",
    explanation:
      "2 is in the left subtree of 4. Pre-order visits a node before its subtrees, so it visits 4 first. In-order and post-order both finish the left subtree before they visit 4, so they visit 2 first.",
    reviewLesson: "post-order",
    hints: [
      "Where is 2 in relation to 4?",
      "Which orders visit a node's left subtree before the node?",
    ],
    tree: "8,4,2,#,#,6,#,#,12,10,#,#,14,#,#",
    options: [
      { key: "in-and-post", text: "In-order and post-order", isCorrect: true },
      { key: "pre-and-in", text: "Pre-order and in-order", isCorrect: false },
      { key: "pre-and-post", text: "Pre-order and post-order", isCorrect: false },
      { key: "all-three", text: "All three", isCorrect: false },
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
