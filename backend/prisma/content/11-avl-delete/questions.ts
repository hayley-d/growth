import type { WrittenQuestionContent } from "@/infrastructure/course-content/content/content-schema";

export default [
  {
    key: "delete-case-one-child",
    type: "multiple_choice",
    difficulty: 1,
    bloomsLevel: "remember",
    prompt: "You delete 40 from this tree. What happens to it?",
    explanation:
      "40 has one child, 35. The child takes the place of 40, and nothing else in the tree moves.",
    reviewLesson: "avl-delete",
    hints: [
      "Count the children of 40 first.",
      "The number of children decides which delete case applies.",
    ],
    tree: "50,30,20,#,#,40,35,#,#,#,70,60,#,#,#",
    options: [
      { key: "child-up", text: "Its child takes its place", isCorrect: true },
      { key: "just-remove", text: "It is removed and nothing takes its place", isCorrect: false },
      {
        key: "successor",
        text: "It is replaced by the smallest key in its right subtree",
        isCorrect: false,
      },
      { key: "parent-goes", text: "Its parent is removed too", isCorrect: false },
    ],
  },
  {
    key: "delete-successor-choice",
    type: "multiple_choice",
    difficulty: 2,
    bloomsLevel: "apply",
    prompt: "You delete 40, the root. Which key takes its place?",
    explanation:
      "40 has two children, so it is replaced by its in-order successor. That is the smallest key in the right subtree: go right to 60, then left to 50. The old 50 is then removed.",
    reviewLesson: "avl-delete",
    hints: [
      "Decide which subtree the replacement comes from.",
      "Inside that subtree, the replacement is the smallest key. Keep going left until you cannot.",
    ],
    tree: "40,20,10,#,#,30,#,#,60,50,#,#,70,#,#",
    options: [
      { key: "fifty", text: "50", isCorrect: true },
      { key: "thirty", text: "30", isCorrect: false },
      { key: "sixty", text: "60", isCorrect: false },
      { key: "twenty", text: "20", isCorrect: false },
    ],
  },
  {
    key: "delete-successor-text",
    type: "text",
    difficulty: 3,
    bloomsLevel: "apply",
    prompt: "You delete 50, the root, from this tree. Which key takes its place?",
    explanation:
      "50 has two children, so the in-order successor takes its place. Go right to 70, then left to 60. 60 has no left child, so it is the smallest key in the right subtree. The tree is still balanced after the swap, so nothing is rotated.",
    reviewLesson: "avl-delete",
    hints: [
      "Start in the right subtree of the node you delete.",
      "Move left as far as you can. The last node you reach is the smallest key there.",
    ],
    tree: "50,30,20,#,#,40,#,#,70,60,#,#,80,#,#",
    accepted: [
      { key: "sixty", text: "60" },
      { key: "sixty-word", text: "sixty" },
    ],
  },
  {
    key: "delete-one-child-result",
    type: "build_tree",
    difficulty: 2,
    bloomsLevel: "apply",
    prompt: "Delete 40 from this AVL tree and rebalance if needed. Build the tree you get.",
    explanation:
      "40 has one child, 35, which takes its place. 30 now has two leaf children and a balance factor of 0. 50 has a left height of 2 and a right height of 2. Nothing reaches -2 or 2, so no rotation is needed.",
    reviewLesson: "avl-delete",
    hints: [
      "Count the children of 40 first, then remove it the way that case says.",
      "After deleting, work out the balance factor of each node on the path from where 40 was back up to the root.",
      "Only a balance factor of -2 or 2 needs a rotation.",
    ],
    tree: "50,30,20,#,#,40,35,#,#,#,70,60,#,#,#",
    answer: { type: "build_tree", tree: "50,30,20,#,#,35,#,#,70,60,#,#,#" },
  },
  {
    key: "delete-rotation-result",
    type: "build_tree",
    difficulty: 3,
    bloomsLevel: "apply",
    prompt: "Delete 50 from this AVL tree and rebalance if needed. Build the tree you get.",
    explanation:
      "50 is a leaf, so it is just removed. 60 now has nothing on its left and a subtree of height 2 on its right, so its balance factor is -2. Its right child 80 has a balance factor of 0, so one left rotation at 60 is enough. 80 ends up on top.",
    reviewLesson: "avl-delete",
    hints: [
      "Remove the key first, then check the balance factor of each node on the path back up to the root.",
      "The lowest node out of range is the one to fix. Look at its heavy child to pick the rotation.",
      "A child with a balance factor of 0 does not lean either way. Think about which case from the lesson that matches.",
    ],
    tree: "60,50,#,#,80,70,#,#,90,#,#",
    answer: { type: "build_tree", tree: "80,60,#,70,#,#,90,#,#" },
  },
  {
    key: "delete-heavy-child-balanced",
    type: "multiple_choice",
    difficulty: 3,
    bloomsLevel: "understand",
    prompt:
      "After a delete, a node has a balance factor of -2. Its right child has a balance factor of 0. Which fix needs the fewest rotations?",
    explanation:
      "The node leans right and its right child does not lean left, so one left rotation at the node fixes it. A child with a balance factor of 0 only happens after a delete, never after an insert.",
    reviewLesson: "avl-delete",
    hints: [
      "Compare the way the node leans with the way its heavy child leans.",
      "A balance factor of 0 means the child does not lean either way.",
    ],
    options: [
      { key: "single-left", text: "One left rotation at the node", isCorrect: true },
      {
        key: "right-left",
        text: "Rotate the child right, then the node left",
        isCorrect: false,
      },
      {
        key: "no-fix",
        text: "No fix, a balance factor of 0 below means it is fine",
        isCorrect: false,
      },
      { key: "single-right", text: "One right rotation at the node", isCorrect: false },
    ],
  },
  {
    key: "delete-rotation-ripple",
    type: "multiple_choice",
    difficulty: 4,
    bloomsLevel: "understand",
    prompt:
      "A delete fixes a node with a rotation, and the fixed subtree ends up one level shorter than before. What does that mean for the nodes above it?",
    explanation:
      "A shorter subtree changes the balance factor of its parent. The parent may now be out of range, so the walk back up has to keep checking every ancestor, all the way to the root.",
    reviewLesson: "avl-delete",
    hints: [
      "Think about how a balance factor is worked out from the heights of two subtrees.",
      "If one of those heights changes, what happens to the balance factor above it?",
    ],
    options: [
      {
        key: "keep-checking",
        text: "A node above may be out of balance too, so keep checking up to the root",
        isCorrect: true,
      },
      { key: "all-fine", text: "Nothing above can change, so stop", isCorrect: false },
      { key: "root-only", text: "Only the root needs checking", isCorrect: false },
      { key: "undo", text: "The delete must be undone", isCorrect: false },
    ],
  },
  {
    key: "delete-predict-rotation-none",
    type: "predict_rotation",
    difficulty: 1,
    bloomsLevel: "apply",
    prompt:
      "Delete 10 from this AVL tree. Which rotation fixes the tree, and which node is the pivot (the lowest unbalanced node)? If no rotation is needed, choose none.",
    explanation:
      "10 is a leaf, so it is removed. 20 now has a balance factor of -1 and 40 has a balance factor of 0. Nothing reaches -2 or 2, so no rotation is needed.",
    reviewLesson: "avl-delete",
    hints: [
      "Remove the key first, then work out the balance factor of each node on the path back up.",
      "Only a balance factor of -2 or 2 needs a rotation.",
    ],
    tree: "40,20,10,#,#,30,#,#,60,50,#,#,70,#,#",
    answer: { type: "predict_rotation", rotation: "none", pivotKey: null },
  },
  {
    key: "delete-predict-rotation-single",
    type: "predict_rotation",
    difficulty: 2,
    bloomsLevel: "apply",
    prompt:
      "Delete 20 from this AVL tree. Which rotation fixes the tree, and which node is the pivot (the lowest unbalanced node)? If no rotation is needed, choose none.",
    explanation:
      "20 is a leaf, so it is removed. 40 now has nothing on its left and a subtree of height 2 on its right, so its balance factor is -2. Its right child 60 leans right too, so one left rotation at 40 fixes it.",
    reviewLesson: "avl-delete",
    hints: [
      "Remove the key first, then check the balance factor of each node on the path back up.",
      "Look at the child of the lowest unbalanced node on its heavy side. Does it lean the same way?",
    ],
    tree: "40,20,#,#,60,#,70,#,#",
    answer: { type: "predict_rotation", rotation: "left", pivotKey: 40 },
  },
  {
    key: "delete-predict-rotation-double",
    type: "predict_rotation",
    difficulty: 3,
    bloomsLevel: "analyse",
    prompt:
      "Delete 20 from this AVL tree. Which rotation fixes the tree, and which node is the pivot (the lowest unbalanced node)? If no rotation is needed, choose none.",
    explanation:
      "20 is a leaf, so it is removed. 40 now has a balance factor of -2. Its right child 60 leans left, so rotate 60 right, then rotate 40 left. 50 ends up on top.",
    reviewLesson: "avl-delete",
    hints: [
      "Remove the key first, then check the balance factor of each node on the path back up.",
      "Compare the way the unbalanced node leans with the way its heavy child leans.",
    ],
    tree: "40,20,#,#,60,50,#,#,#",
    answer: { type: "predict_rotation", rotation: "rightLeft", pivotKey: 40 },
  },
  {
    key: "delete-predict-rotation-balanced-child",
    type: "predict_rotation",
    difficulty: 4,
    bloomsLevel: "analyse",
    prompt:
      "Delete 60 from this AVL tree. Which rotation fixes the tree, and which node is the pivot (the lowest unbalanced node)? If no rotation is needed, choose none.",
    explanation:
      "60 is a leaf, so it is removed. 40 now has a left height of 2 and a right height of 0, so its balance factor is 2. Its left child 20 has a balance factor of 0, so it does not lean right. One right rotation at 40 fixes it.",
    reviewLesson: "avl-delete",
    hints: [
      "Remove the key first, then check the balance factor of each node on the path back up.",
      "Check the heavy child too. It might not lean either way.",
    ],
    tree: "40,20,10,#,#,30,#,#,60,#,#",
    answer: { type: "predict_rotation", rotation: "right", pivotKey: 40 },
  },
] satisfies WrittenQuestionContent[];
