import type { WrittenQuestionContent } from "@/infrastructure/course-content/content/content-schema";

export default [
  {
    key: "tap-pre-order-lopsided",
    type: "order_nodes",
    difficulty: 2,
    bloomsLevel: "apply",
    prompt: "Tap the nodes of this tree in pre-order.",
    explanation:
      "Pre-order visits the node, then the left subtree, then the right subtree. That gives 10, then 6 and 8 on the left, then 15 and 12 on the right.",
    reviewLesson: "pre-order",
    hints: [
      "Visit a node the moment you reach it.",
      "6 has no left child, so its right child 8 comes straight after it.",
    ],
    tree: "10,6,#,8,#,#,15,12,#,#,#",
    answer: { type: "order_nodes", keys: [10, 6, 8, 15, 12] },
  },
  {
    key: "tap-in-order-lopsided",
    type: "order_nodes",
    difficulty: 3,
    bloomsLevel: "apply",
    prompt: "Tap the nodes of this tree in in-order.",
    explanation:
      "In-order visits the left subtree, then the node, then the right subtree. 5 has no left child, so it comes first. Then its right subtree gives 7, 9, then the root 12, then 20.",
    reviewLesson: "in-order",
    hints: [
      "Go as far left as you can before you visit anything.",
      "A node waits until its whole left subtree is done.",
      "9 has a left child, 7, that comes before it.",
    ],
    tree: "12,5,#,9,7,#,#,#,20,#,#",
    answer: { type: "order_nodes", keys: [5, 7, 9, 12, 20] },
  },
  {
    key: "tap-post-order",
    type: "order_nodes",
    difficulty: 2,
    bloomsLevel: "apply",
    prompt: "Tap the nodes of this tree in post-order.",
    explanation:
      "Post-order visits the left subtree, then the right subtree, then the node. The left side gives 1, 4, 3. The right side gives 9, 8. The root 5 comes last.",
    reviewLesson: "post-order",
    hints: [
      "A node is visited after both of its subtrees.",
      "The root is always last.",
      "8 has no left child, so its right child 9 is visited before it.",
    ],
    tree: "5,3,1,#,#,4,#,#,8,#,9,#,#",
    answer: { type: "order_nodes", keys: [1, 4, 3, 9, 8, 5] },
  },
  {
    key: "tap-level-order",
    type: "order_nodes",
    difficulty: 2,
    bloomsLevel: "apply",
    prompt: "Tap the nodes of this tree in level-order.",
    explanation:
      "Level-order goes one row at a time, left to right. Row one is 7, row two is 4 and 9, and row three is 2, 8 and 11.",
    reviewLesson: "level-order",
    hints: ["Finish a whole row before you go down.", "Within a row, go left to right."],
    tree: "7,4,2,#,#,#,9,8,#,#,11,#,#",
    answer: { type: "order_nodes", keys: [7, 4, 9, 2, 8, 11] },
  },
  {
    key: "tap-post-order-lopsided",
    type: "order_nodes",
    difficulty: 3,
    bloomsLevel: "apply",
    prompt: "Tap the nodes of this tree in post-order.",
    explanation:
      "Post-order visits the left subtree, then the right subtree, then the node. Under 2 the only child is 4, so 4 comes first, then 2. Under 9 the only child is 7, so 7 then 9. The root 6 is last.",
    reviewLesson: "post-order",
    hints: [
      "Nothing is visited before its children are.",
      "A node with one child visits that child, then itself.",
    ],
    tree: "6,2,#,4,#,#,9,7,#,#,#",
    answer: { type: "order_nodes", keys: [4, 2, 7, 9, 6] },
  },
  {
    key: "tap-in-order-balanced",
    type: "order_nodes",
    difficulty: 2,
    bloomsLevel: "apply",
    prompt: "Tap the nodes of this tree in in-order.",
    explanation:
      "In-order visits the left subtree, then the node, then the right subtree. The left side gives 6, 9, 11. Then the root 14. The right side gives 18, 21.",
    reviewLesson: "in-order",
    hints: [
      "The root comes after everything on its left.",
      "In a search tree, in-order gives the keys from smallest to largest.",
    ],
    tree: "14,9,6,#,#,11,#,#,18,#,21,#,#",
    answer: { type: "order_nodes", keys: [6, 9, 11, 14, 18, 21] },
  },
  {
    key: "which-traversal-gives-this-pre",
    type: "multiple_choice",
    difficulty: 2,
    bloomsLevel: "analyse",
    prompt:
      "A traversal of this tree visits the nodes in the order 14, 9, 6, 11, 18, 21. Which traversal is it?",
    explanation:
      "The root 14 is first, and the whole left subtree 9, 6, 11 comes before the right subtree 18, 21. That is pre-order. Level-order would give 14, 9, 18, 6, 11, 21.",
    reviewLesson: "pre-order",
    hints: [
      "Look at where the root, 14, appears in the sequence.",
      "Does the sequence finish a whole subtree before it moves to the next?",
    ],
    tree: "14,9,6,#,#,11,#,#,18,#,21,#,#",
    options: [
      { key: "pre-order", text: "Pre-order", isCorrect: true },
      { key: "in-order", text: "In-order", isCorrect: false },
      { key: "post-order", text: "Post-order", isCorrect: false },
      { key: "level-order", text: "Level-order", isCorrect: false },
    ],
  },
  {
    key: "which-traversal-gives-this-in",
    type: "multiple_choice",
    difficulty: 2,
    bloomsLevel: "analyse",
    prompt:
      "A traversal of this tree visits the nodes in the order 6, 8, 10, 12, 15. Which traversal is it?",
    explanation:
      "The root 10 is in the middle, with 6 and 8 from its left side before it and 12 and 15 from its right side after it. That is in-order.",
    reviewLesson: "in-order",
    hints: [
      "Look at where the root, 10, appears in the sequence.",
      "Which nodes come before the root, and which side were they on?",
    ],
    tree: "10,6,#,8,#,#,15,12,#,#,#",
    options: [
      { key: "pre-order", text: "Pre-order", isCorrect: false },
      { key: "in-order", text: "In-order", isCorrect: true },
      { key: "post-order", text: "Post-order", isCorrect: false },
      { key: "level-order", text: "Level-order", isCorrect: false },
    ],
  },
  {
    key: "which-traversal-gives-this-level",
    type: "multiple_choice",
    difficulty: 3,
    bloomsLevel: "analyse",
    prompt:
      "A traversal of this tree visits the nodes in the order 6, 2, 9, 4, 7. Which traversal is it?",
    explanation:
      "The sequence goes row by row. Row one is 6, row two is 2 and 9, and row three is 4 and 7. That is level-order. Pre-order would give 6, 2, 4, 9, 7.",
    reviewLesson: "level-order",
    hints: [
      "Compare each node's depth as you read the sequence.",
      "Does the sequence ever go down a level and then come back up?",
    ],
    tree: "6,2,#,4,#,#,9,7,#,#,#",
    options: [
      { key: "pre-order", text: "Pre-order", isCorrect: false },
      { key: "in-order", text: "In-order", isCorrect: false },
      { key: "post-order", text: "Post-order", isCorrect: false },
      { key: "level-order", text: "Level-order", isCorrect: true },
    ],
  },
  {
    key: "right-child-from-pre-and-in",
    type: "text",
    difficulty: 4,
    bloomsLevel: "analyse",
    prompt:
      "A tree has pre-order 8, 3, 1, 6, 4, 7, 10, 14, 13 and in-order 1, 3, 4, 6, 7, 8, 10, 13, 14. Which key is the right child of the root?",
    explanation:
      "Pre-order starts with the root, 8. In the in-order list, 10, 13 and 14 come after 8, so they are the right subtree. In pre-order that subtree is 10, 14, 13, so its root, and the right child of 8, is 10.",
    reviewLesson: "pre-order",
    hints: [
      "The first key in pre-order is the root.",
      "Everything after the root in the in-order list is in the right subtree.",
      "The first of those keys in the pre-order list is the root of that subtree.",
    ],
    accepted: [
      { key: "ten", text: "10" },
      { key: "ten-word", text: "ten" },
    ],
  },
  {
    key: "right-child-from-post-and-in",
    type: "text",
    difficulty: 4,
    bloomsLevel: "analyse",
    prompt:
      "A tree has post-order 2, 7, 5, 15, 12, 9 and in-order 2, 5, 7, 9, 12, 15. Which key is the right child of the root?",
    explanation:
      "Post-order ends with the root, 9. In the in-order list, 12 and 15 come after 9, so they are the right subtree. In post-order that subtree is 15, 12, so its root, and the right child of 9, is 12.",
    reviewLesson: "post-order",
    hints: [
      "The last key in post-order is the root.",
      "Everything after the root in the in-order list is in the right subtree.",
      "The last of those keys in the post-order list is the root of that subtree.",
    ],
    accepted: [
      { key: "twelve", text: "12" },
      { key: "twelve-word", text: "twelve" },
    ],
  },
  {
    key: "what-is-a-leaf",
    type: "multiple_choice",
    difficulty: 1,
    bloomsLevel: "remember",
    prompt: "A node has no children. What is it called?",
    explanation:
      "A node with no children is a leaf. The root is the top node, a parent has at least one child, and a subtree is a node together with everything below it.",
    reviewLesson: "binary-tree",
    hints: ["Think of the ends of the branches.", "The root is at the top, not the bottom."],
    options: [
      { key: "leaf", text: "A leaf", isCorrect: true },
      { key: "root", text: "The root", isCorrect: false },
      { key: "parent", text: "A parent", isCorrect: false },
      { key: "subtree", text: "A subtree", isCorrect: false },
    ],
  },
  {
    key: "left-subtree-of-five",
    type: "multiple_choice",
    difficulty: 2,
    bloomsLevel: "understand",
    prompt: "Which nodes make up the left subtree of 5?",
    explanation:
      "The left subtree of 5 is the left child, 3, together with everything below it, which is 1 and 4. 8 and 9 are the right subtree.",
    reviewLesson: "binary-tree",
    hints: [
      "A subtree is a node together with everything below it.",
      "Start from the left child of 5.",
    ],
    tree: "5,3,1,#,#,4,#,#,8,#,9,#,#",
    options: [
      { key: "three-one-four", text: "3, 1 and 4", isCorrect: true },
      { key: "three-only", text: "3 only", isCorrect: false },
      { key: "one-four", text: "1 and 4", isCorrect: false },
      { key: "eight-nine", text: "8 and 9", isCorrect: false },
    ],
  },
  {
    key: "count-the-leaves",
    type: "text",
    difficulty: 1,
    bloomsLevel: "apply",
    prompt: "How many leaves does this tree have?",
    explanation: "The leaves are the nodes with no children: 2, 8 and 11. That is 3 leaves.",
    reviewLesson: "binary-tree",
    hints: ["A leaf has no left child and no right child.", "Check the bottom of each branch."],
    tree: "7,4,2,#,#,#,9,8,#,#,11,#,#",
    accepted: [
      { key: "three", text: "3" },
      { key: "three-word", text: "three" },
    ],
  },
  {
    key: "height-of-lopsided-tree",
    type: "text",
    difficulty: 2,
    bloomsLevel: "apply",
    prompt: "What is the height of this tree? A leaf has height 1 and an empty tree has height 0.",
    explanation:
      "The longest path down is 12, 5, 9, 7. That path has 4 nodes, so the height is 4. It is longer than the path down the right side, 12 and 20.",
    reviewLesson: "binary-tree",
    hints: [
      "Height counts the nodes on the longest path down to a leaf.",
      "Don't stop at the first leaf you find. Check every branch.",
    ],
    tree: "12,5,#,9,7,#,#,#,20,#,#",
    accepted: [
      { key: "four", text: "4" },
      { key: "four-word", text: "four" },
    ],
  },
] satisfies WrittenQuestionContent[];
