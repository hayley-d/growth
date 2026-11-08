import type { WrittenQuestionContent } from "@/infrastructure/course-content/content/content-schema";

export default [
  {
    key: "root",
    type: "multiple_choice",
    difficulty: 1,
    bloomsLevel: "remember",
    prompt: "Which node is the root?",
    explanation: "The root is the node with no parent.",
    reviewLesson: "binary-tree",
    hints: ["Look at the top.", "It has no parent."],
    tree: "20,10,#,#,30,#,#",
    options: [
      { key: "a", text: "20", isCorrect: true },
      { key: "b", text: "10", isCorrect: false },
    ],
  },
  {
    key: "children",
    type: "text",
    difficulty: 1,
    bloomsLevel: "remember",
    prompt: "How many children can a node have at most?",
    explanation: "A binary tree node has at most two children.",
    reviewLesson: "binary-tree",
    hints: ["Think of the word binary.", "Binary means two."],
    accepted: [
      { key: "a", text: "2" },
      { key: "b", text: "two" },
    ],
  },
  {
    key: "visit-order",
    type: "order_nodes",
    difficulty: 2,
    bloomsLevel: "apply",
    prompt: "Tap the nodes in pre-order.",
    explanation: "Pre-order visits the root, then left, then right.",
    reviewLesson: "binary-tree",
    hints: ["Start at the root.", "Then go left."],
    tree: "20,10,#,#,30,#,#",
    answer: { type: "order_nodes", keys: [20, 10, 30] },
  },
] satisfies WrittenQuestionContent[];
