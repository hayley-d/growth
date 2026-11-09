import type { WrittenQuestionContent } from "@/infrastructure/course-content/content/content-schema";

const sevenNodeTree = "8,4,2,#,#,6,#,#,12,10,#,#,14,#,#";

export default [
  {
    key: "find-the-root",
    type: "multiple_choice",
    difficulty: 1,
    bloomsLevel: "remember",
    prompt: "Which node is the root of this tree?",
    explanation: "The root is the node at the top. It is the only node with nothing above it.",
    reviewLesson: "binary-tree",
    hints: ["Look for the node at the very top.", "The root has no parent."],
    tree: sevenNodeTree,
    options: [
      { key: "four", text: "4", isCorrect: false },
      { key: "eight", text: "8", isCorrect: true },
      { key: "two", text: "2", isCorrect: false },
      { key: "twelve", text: "12", isCorrect: false },
    ],
  },
  {
    key: "find-a-leaf",
    type: "multiple_choice",
    difficulty: 1,
    bloomsLevel: "remember",
    prompt: "Which of these nodes is a leaf?",
    explanation:
      "A leaf has no children. 2 has nothing below it, while 4, 8 and 12 each have two children.",
    reviewLesson: "binary-tree",
    hints: ["A leaf has no children.", "Look at the bottom row of the tree."],
    tree: sevenNodeTree,
    options: [
      { key: "four", text: "4", isCorrect: false },
      { key: "eight", text: "8", isCorrect: false },
      { key: "twelve", text: "12", isCorrect: false },
      { key: "two", text: "2", isCorrect: true },
    ],
  },
  {
    key: "count-the-leaves",
    type: "text",
    difficulty: 1,
    bloomsLevel: "understand",
    prompt: "How many leaves does this tree have?",
    explanation: "The leaves are 2, 6, 10 and 14, so there are four.",
    reviewLesson: "binary-tree",
    hints: ["A leaf has no children.", "Count the nodes in the bottom row."],
    tree: sevenNodeTree,
    accepted: [
      { key: "four-digit", text: "4" },
      { key: "four-word", text: "four" },
    ],
  },
  {
    key: "parent-of-six",
    type: "multiple_choice",
    difficulty: 1,
    bloomsLevel: "understand",
    prompt: "Which node is the parent of 6?",
    explanation: "The parent is the node directly above. 6 hangs below 4, so 4 is its parent.",
    reviewLesson: "binary-tree",
    hints: ["The parent is directly above the node.", "Follow the line up from 6."],
    tree: sevenNodeTree,
    options: [
      { key: "two", text: "2", isCorrect: false },
      { key: "eight", text: "8", isCorrect: false },
      { key: "four", text: "4", isCorrect: true },
      { key: "twelve", text: "12", isCorrect: false },
    ],
  },
  {
    key: "depth-of-fourteen",
    type: "text",
    difficulty: 2,
    bloomsLevel: "apply",
    prompt: "What is the depth of 14? The root has depth 0.",
    explanation:
      "From 8 down to 12 is one edge, and from 12 down to 14 is another, so 14 has depth 2.",
    reviewLesson: "binary-tree",
    hints: ["Count the edges from the root down to 14.", "The path is 8, 12, 14."],
    tree: sevenNodeTree,
    accepted: [
      { key: "two-digit", text: "2" },
      { key: "two-word", text: "two" },
    ],
  },
  {
    key: "left-subtree-of-eight",
    type: "multiple_choice",
    difficulty: 2,
    bloomsLevel: "understand",
    prompt: "Which nodes are in the left subtree of 8?",
    explanation:
      "The left subtree of 8 is 4 and everything below it, which is 4, 2 and 6. 12, 10 and 14 are in the right subtree.",
    reviewLesson: "binary-tree",
    hints: ["A subtree is a node and everything below it.", "Start at the left child of 8."],
    tree: sevenNodeTree,
    options: [
      { key: "twelve-ten-fourteen", text: "12, 10 and 14", isCorrect: false },
      { key: "four-two-six", text: "4, 2 and 6", isCorrect: true },
      { key: "four-twelve", text: "4 and 12", isCorrect: false },
      { key: "two-six-ten-fourteen", text: "2, 6, 10 and 14", isCorrect: false },
    ],
  },
  {
    key: "where-does-five-go",
    type: "multiple_choice",
    difficulty: 2,
    bloomsLevel: "apply",
    prompt: "You insert 5 into this search tree. Where does it go?",
    explanation:
      "5 is smaller than 8, so go left. 5 is bigger than 4, so go right. 5 is smaller than 6, so go left. It becomes the left child of 6.",
    reviewLesson: "binary-tree",
    hints: [
      "Start at the root and compare 5 with it.",
      "Smaller goes left and bigger goes right, at every node on the way down.",
      "The path is 8, then 4, then 6.",
    ],
    tree: sevenNodeTree,
    options: [
      { key: "right-of-six", text: "The right child of 6", isCorrect: false },
      { key: "right-of-two", text: "The right child of 2", isCorrect: false },
      { key: "left-of-six", text: "The left child of 6", isCorrect: true },
      { key: "left-of-twelve", text: "The left child of 12", isCorrect: false },
    ],
  },
  {
    key: "spot-the-misplaced-key",
    type: "multiple_choice",
    difficulty: 2,
    bloomsLevel: "analyse",
    prompt:
      "This is meant to be a binary search tree, but one key is in the wrong place. Which one?",
    explanation:
      "9 sits in the left subtree of 8, so it should be smaller than 8. It is bigger, so it breaks the rule.",
    reviewLesson: "binary-tree",
    hints: [
      "Everything in the left subtree of a node must be smaller than the node.",
      "Check each key against the root first.",
    ],
    tree: "8,4,2,#,#,9,#,#,12,10,#,#,14,#,#",
    options: [
      { key: "ten", text: "10", isCorrect: false },
      { key: "four", text: "4", isCorrect: false },
      { key: "fourteen", text: "14", isCorrect: false },
      { key: "nine", text: "9", isCorrect: true },
    ],
  },
] satisfies WrittenQuestionContent[];
