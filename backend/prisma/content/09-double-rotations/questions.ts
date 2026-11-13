import type { WrittenQuestionContent } from "@/infrastructure/course-content/content/content-schema";

export default [
  {
    key: "new-root-after-double",
    type: "text",
    difficulty: 1,
    bloomsLevel: "remember",
    prompt:
      "Tree 30 with left child 10, and 10 has right child 20. After the double rotation that fixes it, what key is the new root?",
    explanation:
      "The path from 30 goes left, then right, so this is left-right and it needs two rotations. Rotate left at 10, then right at 30. 20, the node where the path turns, becomes the new root, with 10 on the left and 30 on the right.",
    reviewLesson: "double-rotations",
    hints: [
      "In a double rotation, the node where the path turns ends up on top.",
      "The path goes 30, 10, 20 and turns at 10. The node after the turn is 20.",
    ],
    tree: "30,10,#,20,#,#,#",
    accepted: [{ key: "twenty", text: "20" }],
  },
  {
    key: "spot-left-right",
    type: "multiple_choice",
    difficulty: 1,
    bloomsLevel: "understand",
    prompt:
      "A node has balance factor +2 and its left child has balance factor −1. Which rotations fix it?",
    explanation:
      "The node is heavy on its left and its taller child is heavy on its right. Opposite signs mean the left-right case. Rotate left at the child first, then rotate right at the node.",
    reviewLesson: "double-rotations",
    hints: [
      "Compare the two signs. Same sign means one rotation, opposite signs mean two.",
      "+2 and −1 are opposite signs, so this is left-right. The first rotation is on the child.",
    ],
    options: [
      {
        key: "left-child-then-right-node",
        text: "A left rotation on the child, then a right rotation on the node",
        isCorrect: true,
      },
      { key: "right-node-only", text: "One right rotation on the node", isCorrect: false },
      {
        key: "right-child-then-left-node",
        text: "A right rotation on the child, then a left rotation on the node",
        isCorrect: false,
      },
      { key: "left-node-only", text: "One left rotation on the node", isCorrect: false },
    ],
  },
  {
    key: "why-one-fails",
    type: "multiple_choice",
    difficulty: 3,
    bloomsLevel: "analyse",
    prompt:
      "A node is left-right: balance factor +2, with a left child at −1. Why does one right rotation on the node not fix it?",
    explanation:
      "The extra height is in the child's right subtree, the inner subtree. A right rotation moves the inner subtree across to the other side without lifting it, so the tree just leans the other way. Rotating the child first straightens the path, and then one more rotation can fix it.",
    reviewLesson: "double-rotations",
    hints: [
      "Find where the extra height is. Is it on the outside of the path, or on the inside where the path turns?",
      "The heavy part is the inner subtree. A single rotation only moves the inner subtree across.",
    ],
    options: [
      {
        key: "inner-subtree",
        text: "The heavy part is the inner subtree, and one rotation only moves it across to the other side",
        isCorrect: true,
      },
      {
        key: "breaks-order",
        text: "One rotation would put the keys out of in-order order",
        isCorrect: false,
      },
      {
        key: "wrong-node",
        text: "A right rotation is never allowed on a node with balance factor +2",
        isCorrect: false,
      },
      {
        key: "too-many-keys",
        text: "A rotation can only move two keys, and the path has three",
        isCorrect: false,
      },
    ],
  },
  {
    key: "rotate-left-right",
    type: "build_tree",
    difficulty: 2,
    bloomsLevel: "apply",
    prompt: "50 is unbalanced, and the path down from it turns. Rotate to fix the tree.",
    explanation:
      "50 has balance factor +2 and its left child 20 has −1. That is left-right. Rotate left at 20, so 30 moves up. Then rotate right at 50, so 30 moves up to the root. 40 was the right child of 30, so it becomes the left child of 50.",
    reviewLesson: "double-rotations",
    hints: [
      "Opposite signs mean two rotations. The first one is on the child.",
      "Rotate 20 left, then rotate 50 right.",
    ],
    tree: "50,20,10,#,#,30,#,40,#,#,70,#,#",
    answer: { type: "build_tree", tree: "30,20,10,#,#,#,50,40,#,#,70,#,#" },
  },
  {
    key: "rotate-right-left",
    type: "build_tree",
    difficulty: 2,
    bloomsLevel: "apply",
    prompt: "30 is unbalanced, and the path down from it turns. Rotate to fix the tree.",
    explanation:
      "30 has balance factor −2 and its right child 60 has +1. That is right-left. Rotate right at 60, so 50 moves up. Then rotate left at 30, so 50 moves up to the root. 40 was the left child of 50, so it becomes the right child of 30.",
    reviewLesson: "double-rotations",
    hints: [
      "Opposite signs mean two rotations. The first one is on the child.",
      "Rotate 60 right, then rotate 30 left.",
    ],
    tree: "30,20,#,#,60,50,40,#,#,#,70,#,#",
    answer: { type: "build_tree", tree: "50,30,20,#,#,40,#,#,60,#,70,#,#" },
  },
  {
    key: "predict-insert-left-right",
    type: "predict_rotation",
    difficulty: 3,
    bloomsLevel: "apply",
    prompt:
      "Insert 25 into this AVL tree. Which rotation fixes it, and which node is the pivot (the lowest unbalanced node)?",
    explanation:
      "25 goes left of 30. 50 then has balance factor +2, and its left child 20 has −1. Opposite signs, so it is left-right with 50 as the pivot: rotate left at 20, then right at 50.",
    reviewLesson: "double-rotations",
    hints: [
      "Insert 25 as in a plain search tree, then check balance factors on the way back up.",
      "50 is the lowest node at +2. Its left child 20 is at −1, so the signs are opposite.",
    ],
    tree: "50,20,10,#,#,30,#,#,70,#,#",
    answer: { type: "predict_rotation", rotation: "leftRight", pivotKey: 50 },
  },
  {
    key: "predict-insert-right-left",
    type: "predict_rotation",
    difficulty: 3,
    bloomsLevel: "apply",
    prompt:
      "Insert 55 into this AVL tree. Which rotation fixes it, and which node is the pivot (the lowest unbalanced node)?",
    explanation:
      "55 goes right of 50. 30 then has balance factor −2, and its right child 60 has +1. Opposite signs, so it is right-left with 30 as the pivot: rotate right at 60, then left at 30.",
    reviewLesson: "double-rotations",
    hints: [
      "Insert 55 as in a plain search tree, then check balance factors on the way back up.",
      "30 is the lowest node at −2. Its right child 60 is at +1, so the signs are opposite.",
    ],
    tree: "30,20,#,#,60,50,#,#,70,#,#",
    answer: { type: "predict_rotation", rotation: "rightLeft", pivotKey: 30 },
  },
  {
    key: "double-below-root",
    type: "build_tree",
    difficulty: 4,
    bloomsLevel: "apply",
    prompt: "Only one node in this tree is unbalanced. Rotate to fix the tree.",
    explanation:
      "The root 50 is fine. 20 has balance factor +2 and its left child 10 has −1, so 20 is left-right. Rotate left at 10, then right at 20. 15, the node where the path turns, takes the place of 20.",
    reviewLesson: "double-rotations",
    hints: [
      "Check every node, not only the root. Find the lowest node at +2 or −2.",
      "20 is at +2 and 10 is at −1. Rotate 10 left, then 20 right.",
    ],
    tree: "50,30,20,10,#,15,#,#,#,40,#,#,60,#,70,#,#",
    answer: { type: "build_tree", tree: "50,30,15,10,#,#,20,#,#,40,#,#,60,#,70,#,#" },
  },
  {
    key: "child-is-zero",
    type: "multiple_choice",
    difficulty: 3,
    bloomsLevel: "analyse",
    prompt:
      "After a delete, a node has balance factor −2 and its right child has balance factor 0. Which rotations fix it?",
    explanation:
      "The taller child is 0, not +1, so the signs are not opposite and this is not right-left. A child at 0 always gets a single rotation. The node leans right, so rotate left at the node.",
    reviewLesson: "double-rotations",
    hints: [
      "Two rotations are only needed when the taller child has the opposite sign.",
      "0 does not lean either way, so treat it like right-right.",
    ],
    options: [
      { key: "left-node-only", text: "One left rotation on the node", isCorrect: true },
      {
        key: "right-child-then-left-node",
        text: "A right rotation on the child, then a left rotation on the node",
        isCorrect: false,
      },
      { key: "right-node-only", text: "One right rotation on the node", isCorrect: false },
      { key: "none", text: "No rotation, a 0 child means the tree is fine", isCorrect: false },
    ],
  },
] satisfies WrittenQuestionContent[];
