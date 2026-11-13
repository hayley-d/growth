import type { WrittenQuestionContent } from "@/infrastructure/course-content/content/content-schema";

export default [
  {
    key: "root-after-rotation",
    type: "text",
    difficulty: 1,
    bloomsLevel: "remember",
    prompt:
      "Tree 30 with left child 20 with left child 10, after one right rotation at 30. What key is the new root?",
    explanation:
      "The left child of 30 moves up. 20 becomes the new root. 10 stays on the left of 20, and 30 becomes the right child of 20.",
    reviewLesson: "single-rotations",
    hints: [
      "In a right rotation, the left child of the unbalanced node moves up.",
      "20 is the left child of 30, so 20 becomes the new root.",
    ],
    accepted: [{ key: "twenty", text: "20" }],
  },
  {
    key: "which-rotation",
    type: "multiple_choice",
    difficulty: 1,
    bloomsLevel: "understand",
    prompt:
      "A node has balance factor +2 and its left child has balance factor +1. Which one rotation fixes it?",
    explanation: "That is the left-left case. One right rotation on the unbalanced node fixes it.",
    reviewLesson: "single-rotations",
    hints: [
      "There is too much weight on the left of the left.",
      "Left-left means a right rotation on that node, not on its child.",
    ],
    options: [
      { key: "right-on-node", text: "A right rotation on that node", isCorrect: true },
      { key: "left-on-node", text: "A left rotation on that node", isCorrect: false },
      { key: "left-on-child", text: "A left rotation on its child", isCorrect: false },
      { key: "none", text: "No rotation, the tree is already fine", isCorrect: false },
    ],
  },
  {
    key: "rotate-left-left",
    type: "build_tree",
    difficulty: 2,
    bloomsLevel: "apply",
    prompt: "50 leans too far left. Rotate it to fix the tree.",
    explanation:
      "50 has balance factor +2 and its left child 30 has balance factor +1. That is left-left. One right rotation at 50 lifts 30 up. 40, the inner subtree, becomes the left child of 50.",
    reviewLesson: "single-rotations",
    hints: [
      "Find the node whose balance factor is +2.",
      "Left-left means one right rotation on that node. Rotate 50 right.",
    ],
    tree: "50,30,20,10,#,#,#,40,#,#,70,#,#",
    answer: { type: "build_tree", tree: "30,20,10,#,#,#,50,40,#,#,70,#,#" },
  },
  {
    key: "rotate-right-right",
    type: "build_tree",
    difficulty: 2,
    bloomsLevel: "apply",
    prompt: "50 leans too far right. Rotate it to fix the tree.",
    explanation:
      "50 has balance factor −2 and its right child 80 has balance factor −1. That is right-right. One left rotation at 50 lifts 80 up. 70, the inner subtree, becomes the right child of 50.",
    reviewLesson: "single-rotations",
    hints: [
      "Find the node whose balance factor is −2.",
      "Right-right means one left rotation on that node. Rotate 50 left.",
    ],
    tree: "50,30,#,#,80,70,#,#,90,#,100,#,#",
    answer: { type: "build_tree", tree: "80,50,30,#,#,70,#,#,90,#,100,#,#" },
  },
  {
    key: "predict-insert-left-left",
    type: "predict_rotation",
    difficulty: 2,
    bloomsLevel: "apply",
    prompt:
      "Insert 10 into this AVL tree. Which rotation fixes it, and which node is the pivot (the lowest unbalanced node)?",
    explanation:
      "10 hangs left of 20. 50 then has balance factor +2, and 30 has +1. That is left-left, so rotate 50 right. 50 is the lowest unbalanced node, so it is the pivot.",
    reviewLesson: "single-rotations",
    hints: [
      "Insert 10 as in a plain search tree, then look at balance factors on the way back up.",
      "50 is the lowest node with balance factor +2. Its left child leans left, so rotate 50 right.",
    ],
    tree: "50,30,20,#,#,40,#,#,70,#,#",
    answer: { type: "predict_rotation", rotation: "right", pivotKey: 50 },
  },
  {
    key: "predict-insert-right-right",
    type: "predict_rotation",
    difficulty: 2,
    bloomsLevel: "apply",
    prompt:
      "Insert 80 into this AVL tree. Which rotation fixes it, and which node is the pivot (the lowest unbalanced node)?",
    explanation:
      "80 hangs right of 70. 60 then has balance factor −2, and 70 has −1. That is right-right, so rotate 60 left. 60 is the lowest unbalanced node, so it is the pivot.",
    reviewLesson: "single-rotations",
    hints: [
      "Insert 80 as in a plain search tree, then look at balance factors on the way back up.",
      "60 is the lowest node with balance factor −2. Its right child leans right, so rotate 60 left.",
    ],
    tree: "40,20,10,#,#,30,#,#,60,#,70,#,#",
    answer: { type: "predict_rotation", rotation: "left", pivotKey: 60 },
  },
  {
    key: "rotate-below-the-root",
    type: "build_tree",
    difficulty: 3,
    bloomsLevel: "apply",
    prompt: "Only one node in this tree is unbalanced. Rotate it to fix the tree.",
    explanation:
      "Only 60 is unbalanced. It has balance factor −2, and its right child 70 leans right. The root 40 is fine. Rotate 60 left so 70 moves up.",
    reviewLesson: "single-rotations",
    hints: [
      "Check every node, not only the root.",
      "60 has balance factor −2 and its right child leans right. Rotate 60 left.",
    ],
    tree: "40,20,10,#,#,30,#,#,60,#,70,#,80,#,#",
    answer: { type: "build_tree", tree: "40,20,10,#,#,30,#,#,70,60,#,#,80,#,#" },
  },
  {
    key: "why-still-sorted",
    type: "multiple_choice",
    difficulty: 3,
    bloomsLevel: "analyse",
    prompt: "Why is the tree still a valid search tree after a rotation?",
    explanation:
      "A rotation only moves the inner subtree into the one gap between the two nodes. The in-order order of the keys does not change, so smaller keys stay on the left and bigger keys stay on the right.",
    reviewLesson: "single-rotations",
    hints: [
      "Think about in-order, not about heights.",
      "The inner subtree lands in the gap between the two nodes, so the in-order order stays the same.",
    ],
    options: [
      {
        key: "in-order",
        text: "The in-order order of the keys does not change. The inner subtree lands in the gap between the two nodes",
        isCorrect: true,
      },
      {
        key: "sorts",
        text: "The rotation sorts the keys as it turns",
        isCorrect: false,
      },
      {
        key: "heights",
        text: "Heights change, so the search rule is no longer needed",
        isCorrect: false,
      },
      {
        key: "swap",
        text: "Left and right children swap, which keeps the keys in order",
        isCorrect: false,
      },
    ],
  },
] satisfies WrittenQuestionContent[];
