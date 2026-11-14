import type { WrittenQuestionContent } from "@/infrastructure/course-content/content/content-schema";

export default [
  {
    key: "insert-order-of-parts",
    type: "multiple_choice",
    difficulty: 1,
    bloomsLevel: "remember",
    prompt: "What is the order of an AVL insert?",
    explanation:
      "First the key goes in like in a plain binary search tree. Then the code walks back up the path updating heights and checking balance factors. The first node with a balance factor of -2 or 2 gets the rotation.",
    reviewLesson: "avl-insert",
    hints: [
      "A height can only change once the new key is in the tree.",
      "The code needs the updated heights before it can tell which node is out of balance.",
    ],
    options: [
      {
        key: "down-up-fix",
        text: "Place the key, walk back up updating heights, then fix the first unbalanced node",
        isCorrect: true,
      },
      {
        key: "rotate-first",
        text: "Rotate the root, then place the key, then update heights",
        isCorrect: false,
      },
      {
        key: "sort-first",
        text: "Sort all the keys, then rebuild the whole tree",
        isCorrect: false,
      },
      {
        key: "fix-all",
        text: "Place the key, then fix every node on the path from the top down",
        isCorrect: false,
      },
    ],
  },
  {
    key: "first-unbalanced-node",
    type: "multiple_choice",
    difficulty: 2,
    bloomsLevel: "apply",
    prompt:
      "5 was just inserted into this tree and the heights are updated, but nothing is rebalanced yet. Walking up from 5, which node do you fix first?",
    explanation:
      "Walking up from 5, 10 has a balance factor of 1, which is fine. 20 has a left height of 2 and a right height of 0, so its balance factor is 2. It is the first unbalanced node. 30 is also out of balance, but fixing 20 puts it right.",
    reviewLesson: "avl-insert",
    hints: [
      "Start at the new key and move up one parent at a time.",
      "A node is unbalanced when its balance factor is below -1 or above 1. Check the nodes in the order you meet them.",
    ],
    tree: "30,20,10,5,#,#,#,#,40,#,#",
    options: [
      { key: "node-10", text: "10", isCorrect: false },
      { key: "node-20", text: "20", isCorrect: true },
      { key: "node-30", text: "30", isCorrect: false },
      { key: "node-40", text: "40", isCorrect: false },
    ],
  },
  {
    key: "how-many-fixes",
    type: "multiple_choice",
    difficulty: 3,
    bloomsLevel: "understand",
    prompt:
      "You insert one key into a valid AVL tree. At most how many rebalancing fixes does the insert need?",
    explanation:
      "One. The fix is a rotation, or a double rotation counted as one fix. After it, the fixed subtree is as tall as it was before the insert, so the nodes above it keep the same balance factors.",
    reviewLesson: "avl-insert",
    hints: [
      "Compare the height of the fixed subtree with its height before the insert.",
      "The nodes above only change if the height of the subtree below them changes.",
    ],
    options: [
      { key: "one-fix", text: "One fix, then the tree is balanced", isCorrect: true },
      { key: "one-per-node", text: "One fix for every node on the path", isCorrect: false },
      { key: "two-always", text: "Always two fixes", isCorrect: false },
      { key: "never", text: "None, a valid AVL tree never needs a fix", isCorrect: false },
    ],
  },
  {
    key: "balance-factor-after-insert",
    type: "text",
    difficulty: 2,
    bloomsLevel: "apply",
    prompt:
      "You insert 3 into this valid AVL tree and update the heights, but you do not rebalance yet. What is the balance factor of 10?",
    explanation:
      "3 goes left of 5. Now 10 has a left height of 2 (5 with 3 below it) and a right height of 0, so its balance factor is 2 - 0 = 2.",
    reviewLesson: "avl-insert",
    hints: [
      "Find where 3 goes first, then look at the subtrees below 10.",
      "The balance factor is the height of the left subtree minus the height of the right subtree.",
    ],
    tree: "20,10,5,#,#,#,30,#,#",
    accepted: [
      { key: "two", text: "2" },
      { key: "two-word", text: "two" },
    ],
  },
  {
    key: "walk-back-up-order",
    type: "multiple_choice",
    difficulty: 2,
    bloomsLevel: "apply",
    prompt:
      "35 was just inserted into this tree. In which order does the code check the nodes as it walks back up?",
    explanation:
      "35 hangs under 30, so 30 is checked first. Then the code goes to 30's parent, 20, and last to the root, 40.",
    reviewLesson: "avl-insert",
    hints: [
      "The code returns along the same path it went down.",
      "Start at the parent of the new key and move up one parent at a time.",
    ],
    tree: "40,20,10,#,#,30,#,35,#,#,60,50,#,#,70,#,#",
    options: [
      { key: "up-the-path", text: "30, 20, 40", isCorrect: true },
      { key: "root-first", text: "40, 20, 30", isCorrect: false },
      { key: "by-size", text: "20, 30, 40", isCorrect: false },
      { key: "row-by-row", text: "40, 20, 60, 10, 30, 50, 70", isCorrect: false },
    ],
  },
  {
    key: "insert-45-result",
    type: "build_tree",
    difficulty: 3,
    bloomsLevel: "apply",
    prompt: "Insert 45 into this AVL tree and rebalance if needed. Build the tree you get.",
    explanation:
      "45 goes down through 20 and 40, then to the left of 50. 40 now has a balance factor of -2, but its right child 50 leans left, so rotate 50 right and then 40 left. 45 ends up on top of 40 and 50.",
    reviewLesson: "avl-insert",
    hints: [
      "Insert like in a plain binary search tree first: smaller keys go left, larger keys go right.",
      "After inserting, check the balance factor of each node on the path from 45 back up to the root.",
      "The lowest node on that path with a balance factor of -2 or 2 is the one to fix. Look at its heavy child to decide between one rotation and two.",
    ],
    tree: "20,10,#,#,40,#,50,#,#",
    answer: { type: "build_tree", tree: "20,10,#,#,45,40,#,#,50,#,#" },
  },
  {
    key: "predict-rotation-none",
    type: "predict_rotation",
    difficulty: 1,
    bloomsLevel: "apply",
    prompt:
      "Insert 5 into this AVL tree. Which rotation fixes the tree, and which node is the pivot (the lowest unbalanced node)? If no rotation is needed, choose none.",
    explanation:
      "5 goes left of 10. 10 has a balance factor of 1 and 20 has a balance factor of 1. Nothing reaches -2 or 2, so no rotation is needed.",
    reviewLesson: "avl-insert",
    hints: [
      "Insert like in a plain binary search tree first, then work out the balance factor of each node on the path back up.",
      "Only a balance factor of -2 or 2 needs a rotation.",
    ],
    tree: "20,10,#,#,30,#,#",
    answer: { type: "predict_rotation", rotation: "none", pivotKey: null },
  },
  {
    key: "predict-rotation-same-side",
    type: "predict_rotation",
    difficulty: 2,
    bloomsLevel: "apply",
    prompt:
      "Insert 25 into this AVL tree. Which rotation fixes the tree, and which node is the pivot (the lowest unbalanced node)? If no rotation is needed, choose none.",
    explanation:
      "25 goes left of 30. 40 now has a balance factor of 2 and its left child 30 leans left too, so one right rotation at 40 fixes it. 50 is not touched.",
    reviewLesson: "avl-insert",
    hints: [
      "Insert like in a plain binary search tree first, then check the balance factor of each node on the path back up.",
      "Look at the child of the lowest unbalanced node on its heavy side. Does it lean the same way?",
    ],
    tree: "50,40,30,#,#,#,60,#,#",
    answer: { type: "predict_rotation", rotation: "right", pivotKey: 40 },
  },
  {
    key: "predict-rotation-opposite-sides",
    type: "predict_rotation",
    difficulty: 3,
    bloomsLevel: "analyse",
    prompt:
      "Insert 35 into this AVL tree. Which rotation fixes the tree, and which node is the pivot (the lowest unbalanced node)? If no rotation is needed, choose none.",
    explanation:
      "35 goes right of 30. 40 has a balance factor of 1, which is fine. 20 has a balance factor of -2 and its right child 40 leans left, so rotate 40 right, then rotate 20 left.",
    reviewLesson: "avl-insert",
    hints: [
      "Insert like in a plain binary search tree first, then check the balance factor of each node on the path back up.",
      "The lowest unbalanced node is the first one you meet walking up that is out of range, not necessarily the root.",
      "Compare the way the unbalanced node leans with the way its heavy child leans.",
    ],
    tree: "20,10,#,#,40,30,#,#,50,#,#",
    answer: { type: "predict_rotation", rotation: "rightLeft", pivotKey: 20 },
  },
] satisfies WrittenQuestionContent[];
