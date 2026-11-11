import type { WrittenQuestionContent } from "@/infrastructure/course-content/content/content-schema";

const sevenNodeTree = "8,4,2,#,#,6,#,#,12,10,#,#,14,#,#";

export default [
  {
    key: "tap-in-level-order",
    type: "order_nodes",
    difficulty: 2,
    bloomsLevel: "apply",
    prompt: "Tap the nodes of this tree in level-order.",
    explanation:
      "Level-order goes one row at a time, left to right. The root 8 is the first row, then 4 and 12, then 2, 10 and 14.",
    reviewLesson: "level-order",
    hints: [
      "Start at the root and do one row at a time.",
      "The second row is 4 and 12.",
      "The last row holds the children of 4 and 12. Take them in the same order as their parents.",
    ],
    tree: "8,4,2,#,#,#,12,10,#,#,14,#,#",
    answer: { type: "order_nodes", keys: [8, 4, 12, 2, 10, 14] },
  },
  {
    key: "what-a-queue-does",
    type: "multiple_choice",
    difficulty: 1,
    bloomsLevel: "remember",
    prompt: "A queue gives nodes back in which order?",
    explanation:
      "A queue is first in, first out. The node that has waited longest comes out first, like a line at a shop.",
    reviewLesson: "level-order",
    hints: ["Think of a line at a shop.", "Who gets served first?"],
    options: [
      { key: "last-in-first-out", text: "The last node in comes out first", isCorrect: false },
      { key: "first-in-first-out", text: "The first node in comes out first", isCorrect: true },
      { key: "smallest-first", text: "The smallest key comes out first", isCorrect: false },
      { key: "biggest-first", text: "The biggest key comes out first", isCorrect: false },
    ],
  },
  {
    key: "queue-after-the-root",
    type: "multiple_choice",
    difficulty: 2,
    bloomsLevel: "apply",
    prompt:
      "Level-order starts with only 8 in the queue. It takes 8 from the front, visits it and adds its children. What does the queue hold now, front first?",
    explanation:
      "The left child goes in first and the right child second, so the queue holds 4 and then 12. 8 has already left the queue.",
    reviewLesson: "level-order",
    hints: [
      "8 has been taken out of the queue.",
      "The left child is added before the right child.",
    ],
    tree: sevenNodeTree,
    options: [
      { key: "twelve-four", text: "12, 4", isCorrect: false },
      { key: "four-two-six", text: "4, 2, 6", isCorrect: false },
      { key: "four-twelve", text: "4, 12", isCorrect: true },
      { key: "eight-four-twelve", text: "8, 4, 12", isCorrect: false },
    ],
  },
  {
    key: "twelve-before-two",
    type: "multiple_choice",
    difficulty: 2,
    bloomsLevel: "analyse",
    prompt: "Which order visits 12 before it visits 2?",
    explanation:
      "Level-order visits the whole second row, 4 and 12, before it goes down to 2. Pre-order, in-order and post-order all finish the left subtree, which holds 2, before they reach 12.",
    reviewLesson: "level-order",
    hints: [
      "Which order works across rows?",
      "In the depth-first orders, 2 sits in the left subtree.",
    ],
    tree: sevenNodeTree,
    options: [
      { key: "pre-order", text: "Pre-order", isCorrect: false },
      { key: "in-order", text: "In-order", isCorrect: false },
      { key: "post-order", text: "Post-order", isCorrect: false },
      { key: "level-order", text: "Level-order", isCorrect: true },
    ],
  },
  {
    key: "why-a-queue",
    type: "multiple_choice",
    difficulty: 3,
    bloomsLevel: "understand",
    prompt: "Why does level-order use a queue instead of recursion?",
    explanation:
      "Recursion goes deep into one subtree before it comes back. Level-order has to finish a row before it goes down, so the nodes waiting must leave in the order they arrived, which is what a queue does.",
    reviewLesson: "level-order",
    hints: [
      "Recursion finishes one whole subtree first.",
      "Level-order has to finish a whole row first.",
    ],
    options: [
      {
        key: "no-recursion-in-trees",
        text: "Recursion can't be used on a binary tree",
        isCorrect: false,
      },
      {
        key: "queue-first-in",
        text: "Nodes must come out in the order they went in, so each row is finished before the next",
        isCorrect: true,
      },
      { key: "less-memory", text: "A queue always uses less memory", isCorrect: false },
      { key: "sorted-keys", text: "A queue keeps the keys sorted", isCorrect: false },
    ],
  },
] satisfies WrittenQuestionContent[];
