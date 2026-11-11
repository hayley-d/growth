import type { WrittenQuestionContent } from "@/infrastructure/course-content/content/content-schema";

export default [
  {
    key: "balance-factor-from-heights",
    type: "multiple_choice",
    difficulty: 2,
    bloomsLevel: "understand",
    prompt:
      "A node's left subtree has height 3 and its right subtree has height 1. What is its balance factor, and is that allowed in an AVL tree?",
    explanation:
      "Balance factor is left height minus right height, so 3 − 1 = 2. An AVL tree only allows -1, 0 or 1, so this node breaks the rule.",
    reviewLesson: "height-and-balance",
    hints: [
      "Subtract one height from the other. Which one comes first?",
      "Left minus right is 3 − 1. Is that inside -1 to 1?",
    ],
    options: [
      { key: "two-broken", text: "2, so it breaks the AVL rule", isCorrect: true },
      { key: "two-fine", text: "2, which is still allowed", isCorrect: false },
      { key: "minus-two-broken", text: "−2, so it breaks the AVL rule", isCorrect: false },
      { key: "four-broken", text: "4, so it breaks the AVL rule", isCorrect: false },
    ],
  },
  {
    key: "balance-factor-of-twenty",
    type: "text",
    difficulty: 3,
    bloomsLevel: "apply",
    prompt:
      "What is the balance factor of node 20? Balance factor is the height of the left subtree minus the height of the right subtree. A leaf has height 1 and an empty subtree has height 0.",
    explanation:
      "The left subtree of 20 is the leaf 10, height 1. The right subtree is 30 with 25 below it, height 2. So the balance factor is 1 − 2 = −1.",
    reviewLesson: "height-and-balance",
    hints: [
      "Work out the height of each subtree of 20 on its own.",
      "The right subtree is 30 with 25 under it. That's two nodes on the longest path.",
    ],
    tree: "40,20,10,#,#,30,25,#,#,#,60,50,#,#,#",
    accepted: [
      { key: "minus-one", text: "-1" },
      { key: "minus-sign-one", text: "−1" },
    ],
  },
  {
    key: "which-node-breaks",
    type: "multiple_choice",
    difficulty: 3,
    bloomsLevel: "analyse",
    prompt: "Which node in this tree breaks the AVL rule?",
    explanation:
      "70 has no left child, height 0, and its right subtree 80 → 90 has height 2. Its balance factor is 0 − 2 = −2. Every other node is between -1 and 1, and the root is 0.",
    reviewLesson: "height-and-balance",
    hints: [
      "Write each node's height from the leaves up.",
      "Look at the node with only a right child, and a chain under it.",
    ],
    tree: "50,30,20,10,#,#,#,40,#,#,70,#,80,#,90,#,#",
    options: [
      { key: "fifty", text: "50", isCorrect: false },
      { key: "thirty", text: "30", isCorrect: false },
      { key: "seventy", text: "70", isCorrect: true },
      { key: "eighty", text: "80", isCorrect: false },
    ],
  },
  {
    key: "root-is-not-enough",
    type: "multiple_choice",
    difficulty: 3,
    bloomsLevel: "evaluate",
    prompt:
      "Thabo says this tree is an AVL tree because the root, 40, has balance factor 1. Is he right?",
    explanation:
      "The root is fine, but the rule is about every node. 20 has a left subtree of height 2 (10 and 5) and no right child, so its balance factor is 2. The tree is not an AVL tree.",
    reviewLesson: "height-and-balance",
    hints: [
      "The AVL rule talks about every node, not only the root.",
      "Check 20. How tall is its left subtree, and how tall is its right?",
    ],
    tree: "40,20,10,5,#,#,#,#,60,50,#,#,70,#,#",
    options: [
      { key: "yes-root", text: "Yes, the root is all that matters", isCorrect: false },
      { key: "no-twenty", text: "No, 20 has balance factor 2", isCorrect: true },
      { key: "no-root", text: "No, the root must have balance factor 0", isCorrect: false },
      { key: "no-sixty", text: "No, 60 has balance factor −2", isCorrect: false },
    ],
  },
  {
    key: "predict-insert-fifty",
    type: "predict_rotation",
    difficulty: 3,
    bloomsLevel: "apply",
    prompt:
      "Insert 50 into this AVL tree. Which rotation fixes it, and which node is the pivot (the lowest unbalanced node)?",
    explanation:
      "50 hangs right of 40. 30 then has balance factor −2 and 40 has −1. That is right-right, so rotate 30 left. 20 is also at −2 for a moment, but 30 is lower, so 30 is the pivot. Once 30 is fixed, 20 is back to −1.",
    reviewLesson: "single-rotations",
    hints: [
      "Insert 50 as in a plain search tree, then check balance factors on the way back up.",
      "30 is the first node up from 50 with balance factor −2, and its right child leans right.",
    ],
    tree: "20,10,#,#,30,#,40,#,#",
    answer: { type: "predict_rotation", rotation: "left", pivotKey: 30 },
  },
  {
    key: "rotate-sixty-right",
    type: "build_tree",
    difficulty: 3,
    bloomsLevel: "apply",
    prompt: "60 leans too far left. Rotate it to fix the tree.",
    explanation:
      "60 has balance factor +2 and its left child 40 has +1. That is left-left, so rotate 60 right. 40 moves up, and 50, the inner subtree, becomes the left child of 60.",
    reviewLesson: "single-rotations",
    hints: [
      "Left-left means one right rotation on the unbalanced node.",
      "40 moves up. Where does its right child, 50, go?",
    ],
    tree: "60,40,20,10,#,#,30,#,#,50,#,#,80,#,#",
    answer: { type: "build_tree", tree: "40,20,10,#,#,30,#,#,60,50,#,#,80,#,#" },
  },
  {
    key: "where-inner-subtree-goes",
    type: "multiple_choice",
    difficulty: 2,
    bloomsLevel: "understand",
    prompt:
      "You do a right rotation on node X. Its left child Y moves up. Where does Y's old right subtree go?",
    explanation:
      "Y's right subtree holds keys bigger than Y but smaller than X. After the rotation X is Y's right child, and its left side is free, so that inner subtree becomes X's left subtree. The keys stay in order.",
    reviewLesson: "single-rotations",
    hints: [
      "The keys in that subtree sit between Y and X.",
      "After the turn, X has an empty spot on one side.",
    ],
    options: [
      { key: "x-left", text: "It becomes X's left subtree", isCorrect: true },
      { key: "y-left", text: "It becomes Y's left subtree", isCorrect: false },
      { key: "x-right", text: "It becomes X's right subtree", isCorrect: false },
      { key: "removed", text: "It is removed and inserted again", isCorrect: false },
    ],
  },
  {
    key: "delete-child-even",
    type: "multiple_choice",
    difficulty: 4,
    bloomsLevel: "analyse",
    prompt:
      "After a delete, a node has balance factor −2 and its right child has balance factor 0. What fixes it?",
    explanation:
      "The node is right-heavy and its right child doesn't lean left, so this counts as right-right. One left rotation on the node fixes it. A balance factor of 0 on the child only happens after a delete, never after an insert.",
    reviewLesson: "single-rotations",
    hints: [
      "You only need two rotations when the child leans the other way.",
      "A child with balance factor 0 doesn't lean either way. Treat it like right-right.",
    ],
    options: [
      { key: "left-on-node", text: "One left rotation on the node", isCorrect: true },
      {
        key: "right-left",
        text: "Rotate the right child right, then the node left",
        isCorrect: false,
      },
      { key: "right-on-node", text: "One right rotation on the node", isCorrect: false },
      { key: "nothing", text: "Nothing, because the child is balanced", isCorrect: false },
    ],
  },
  {
    key: "name-left-right",
    type: "multiple_choice",
    difficulty: 2,
    bloomsLevel: "understand",
    prompt:
      "A node has balance factor +2 and its left child has balance factor −1. Which case is it, and how do you fix it?",
    explanation:
      "The node leans left but its left child leans right. That is the left-right case. Rotate the left child left first, which turns it into left-left, then rotate the node right.",
    reviewLesson: "double-rotations",
    hints: [
      "Look at which way the node leans, then which way its child leans.",
      "They lean opposite ways, so one rotation won't do.",
    ],
    options: [
      {
        key: "left-right",
        text: "Left-right: rotate the left child left, then the node right",
        isCorrect: true,
      },
      { key: "left-left", text: "Left-left: rotate the node right", isCorrect: false },
      {
        key: "right-left",
        text: "Right-left: rotate the left child right, then the node left",
        isCorrect: false,
      },
      {
        key: "wrong-order",
        text: "Left-right: rotate the node right, then the left child left",
        isCorrect: false,
      },
    ],
  },
  {
    key: "predict-insert-forty",
    type: "predict_rotation",
    difficulty: 3,
    bloomsLevel: "apply",
    prompt:
      "Insert 40 into this AVL tree. Which rotation fixes it, and which node is the pivot (the lowest unbalanced node)?",
    explanation:
      "40 hangs right of 30. 20 then has balance factor −1 and 50 has +2. 50 leans left but its left child leans right, so it's left-right. Rotate 20 left, then rotate 50 right. 50 is the pivot.",
    reviewLesson: "double-rotations",
    hints: [
      "Find the lowest node with balance factor 2 or −2, then look at its heavy child.",
      "50 is +2 and its left child 20 is −1. They lean opposite ways.",
    ],
    tree: "50,20,10,#,#,30,#,#,60,#,#",
    answer: { type: "predict_rotation", rotation: "leftRight", pivotKey: 50 },
  },
  {
    key: "fix-right-left",
    type: "build_tree",
    difficulty: 4,
    bloomsLevel: "apply",
    prompt: "40 leans too far right. Fix the tree.",
    explanation:
      "40 has balance factor −2 and its right child 60 has +1. That is right-left. Rotate 60 right so 50 moves up over it, then rotate 40 left so 50 becomes the root. 45 ends up as the right child of 40.",
    reviewLesson: "double-rotations",
    hints: [
      "40 leans right but 60 leans left. That needs two rotations.",
      "First rotate 60 right, then rotate 40 left. 50 ends up on top.",
    ],
    tree: "40,20,#,#,60,50,45,#,#,#,70,#,#",
    answer: { type: "build_tree", tree: "50,40,20,#,#,45,#,#,60,#,70,#,#" },
  },
  {
    key: "why-not-one-rotation",
    type: "multiple_choice",
    difficulty: 4,
    bloomsLevel: "analyse",
    prompt:
      "In this tree 30 has balance factor +2 and 10 has −1. What goes wrong if you only rotate 30 right?",
    explanation:
      "A right rotation lifts 10 to the top with 30 as its right child, and 20 moves across to be 30's left child. Now 10 has balance factor −2 and leans right while 30 leans left. The tree is just as unbalanced, only mirrored. Rotating 10 left first lines the keys up so one right rotation works.",
    reviewLesson: "double-rotations",
    hints: [
      "Draw the tree after the right rotation. Where does 20 end up?",
      "After the turn, check the balance factor of the new root, 10.",
    ],
    tree: "30,10,#,20,#,#,#",
    options: [
      {
        key: "mirrored",
        text: "10 ends up on top with balance factor −2, so the tree is still unbalanced",
        isCorrect: true,
      },
      { key: "works", text: "Nothing, one right rotation fixes it", isCorrect: false },
      { key: "breaks-order", text: "The keys are no longer in search order", isCorrect: false },
      { key: "loses-node", text: "20 falls out of the tree", isCorrect: false },
    ],
  },
  {
    key: "right-left-first-step",
    type: "multiple_choice",
    difficulty: 2,
    bloomsLevel: "remember",
    prompt: "In the right-left case, which rotation do you do first?",
    explanation:
      "Right-left means the node leans right and its right child leans left. First rotate the right child right, which turns it into right-right. Then rotate the node left.",
    reviewLesson: "double-rotations",
    hints: [
      "The first rotation is on the child, not the unbalanced node.",
      "The child leans left, so turn it the other way.",
    ],
    options: [
      { key: "child-right", text: "A right rotation on the right child", isCorrect: true },
      { key: "node-left", text: "A left rotation on the unbalanced node", isCorrect: false },
      { key: "child-left", text: "A left rotation on the right child", isCorrect: false },
      { key: "node-right", text: "A right rotation on the unbalanced node", isCorrect: false },
    ],
  },
  {
    key: "insert-ten-to-fifty",
    type: "build_tree",
    difficulty: 3,
    bloomsLevel: "apply",
    prompt:
      "Start with an empty AVL tree. Insert 10, 20, 30, 40 and 50 in that order, rebalancing after each one. Build the tree you end up with.",
    explanation:
      "Inserting 30 makes 10 right-right, so 10 rotates left and 20 becomes the root. 40 goes under 30 with no problem. Inserting 50 makes 30 right-right, so 30 rotates left and 40 moves up. The tree is 20 with 10 on the left and 40, 30, 50 on the right.",
    reviewLesson: "avl-insert",
    hints: [
      "Rebalance after every insert, not only at the end.",
      "The first rotation happens when you add 30. The second happens when you add 50.",
    ],
    tree: "#",
    answer: { type: "build_tree", tree: "20,10,#,#,40,30,#,#,50,#,#" },
  },
  {
    key: "root-after-one-to-seven",
    type: "text",
    difficulty: 3,
    bloomsLevel: "apply",
    prompt:
      "Start with an empty AVL tree. Insert 1, 2, 3, 4, 5, 6 and 7 in that order, rebalancing after each one. Which key is at the root at the end?",
    explanation:
      "Inserting 3 makes 2 the root. Inserting 5 rotates 3 left so 4 moves up under 2. Inserting 6 makes 2 right-right, so 4 becomes the root. Inserting 7 rotates 5 left. The result is a full tree with 4 at the root, 2 and 6 below it, and 1, 3, 5, 7 as leaves.",
    reviewLesson: "avl-insert",
    hints: [
      "Draw the tree after each insert and rebalance straight away.",
      "Seven sorted keys end up as a perfect tree three levels tall. Which key is in the middle?",
    ],
    accepted: [
      { key: "four", text: "4" },
      { key: "four-word", text: "four" },
    ],
  },
  {
    key: "predict-insert-ninety-five",
    type: "predict_rotation",
    difficulty: 4,
    bloomsLevel: "analyse",
    prompt:
      "Insert 95 into this AVL tree. Which rotation fixes it, and which node is the pivot (the lowest unbalanced node)?",
    explanation:
      "95 hangs right of 90. On the way back up, 80 reaches −2 first, and its right child 90 is −1, so it's right-right at 80. 70 and 50 are also at −2 for a moment, but rotating 80 left brings that subtree back to its old height and they go back to −1.",
    reviewLesson: "avl-insert",
    hints: [
      "More than one node goes out of balance. Which one is lowest?",
      "Start at 95 and walk up. The first node at −2 is 80.",
    ],
    tree: "50,30,20,#,#,40,#,#,70,60,#,#,80,#,90,#,#",
    answer: { type: "predict_rotation", rotation: "left", pivotKey: 80 },
  },
  {
    key: "predict-insert-sixty-five",
    type: "predict_rotation",
    difficulty: 3,
    bloomsLevel: "analyse",
    prompt:
      "Insert 65 into this AVL tree. Which rotation fixes it, and which node is the pivot (the lowest unbalanced node)? If no rotation is needed, choose none.",
    explanation:
      "65 goes right of 60. 60 is then −1, 70 is +1 and 50 is −1. No node on the path reaches −2 or 2, so no rotation is needed.",
    reviewLesson: "avl-insert",
    hints: [
      "Only the nodes on the path from 65 back to the root can change.",
      "Check 60, 70 and 50. Do any of them reach −2 or 2?",
    ],
    tree: "50,30,20,#,#,40,#,#,70,60,#,#,80,#,#",
    answer: { type: "predict_rotation", rotation: "none", pivotKey: null },
  },
  {
    key: "one-fix-per-insert",
    type: "multiple_choice",
    difficulty: 4,
    bloomsLevel: "understand",
    prompt:
      "After an insert, you fix the lowest unbalanced node. Why are the nodes above it then balanced too?",
    explanation:
      "The insert made that subtree one level taller, which is what pushed its ancestors out of balance. The rotation brings the subtree back to the height it had before the insert. So the ancestors see the same heights as before and their balance factors go back to what they were.",
    reviewLesson: "avl-insert",
    hints: [
      "What did the insert change that the ancestors could notice?",
      "Compare the subtree's height before the insert and after the rotation.",
    ],
    options: [
      {
        key: "height-restored",
        text: "The rotated subtree goes back to its height from before the insert",
        isCorrect: true,
      },
      { key: "rotate-all", text: "The rotation also turns every ancestor", isCorrect: false },
      {
        key: "root-only",
        text: "Only the root can be unbalanced after an insert",
        isCorrect: false,
      },
      {
        key: "not-true",
        text: "They aren't, you must rotate every ancestor too",
        isCorrect: false,
      },
    ],
  },
  {
    key: "insert-with-double",
    type: "build_tree",
    difficulty: 5,
    bloomsLevel: "apply",
    prompt:
      "Start with an empty AVL tree. Insert 30, 20, 10, 25 and 28 in that order, rebalancing after each one. Build the tree you end up with.",
    explanation:
      "Inserting 10 makes 30 left-left, so 30 rotates right and 20 becomes the root. 25 goes left of 30. Inserting 28 puts it right of 25, so 30 is +2 and 25 is −1. That is left-right: rotate 25 left, then 30 right, and 28 moves up. The tree is 20 with 10 on the left and 28, 25, 30 on the right.",
    reviewLesson: "avl-insert",
    hints: [
      "There are two fixes, one after 10 and one after 28.",
      "After 28, 30 leans left and 25 leans right. That needs a double rotation.",
    ],
    tree: "#",
    answer: { type: "build_tree", tree: "20,10,#,#,28,25,#,#,30,#,#" },
  },
  {
    key: "two-children-successor",
    type: "multiple_choice",
    difficulty: 2,
    bloomsLevel: "remember",
    prompt: "You delete a node that has two children. Which key takes its place?",
    explanation:
      "Its in-order successor: the smallest key in its right subtree. That key is bigger than everything on the left and smaller than everything else on the right, so the search order holds. Then you delete the successor from the right subtree.",
    reviewLesson: "avl-delete",
    hints: [
      "The new key has to sit between the two subtrees in sorted order.",
      "Go right once, then left as far as you can.",
    ],
    options: [
      { key: "successor", text: "The smallest key in its right subtree", isCorrect: true },
      { key: "largest-right", text: "The largest key in its right subtree", isCorrect: false },
      { key: "left-child", text: "Its left child", isCorrect: false },
      { key: "root", text: "The root of the tree", isCorrect: false },
    ],
  },
  {
    key: "delete-root-forty",
    type: "build_tree",
    difficulty: 3,
    bloomsLevel: "apply",
    prompt: "Delete 40 from this AVL tree and rebalance if needed. Build the tree you end up with.",
    explanation:
      "40 has two children, so its successor 50, the smallest key on the right, takes its place. 50 is then removed from the right subtree, which leaves 60 with only 70. 60 is −1 and the root is 0, so no rotation is needed.",
    reviewLesson: "avl-delete",
    hints: ["40 has two children. Find its in-order successor.", "50 moves up to the root."],
    tree: "40,20,10,#,#,30,#,#,60,50,#,#,70,#,#",
    answer: { type: "build_tree", tree: "50,20,10,#,#,30,#,#,60,#,70,#,#" },
  },
  {
    key: "predict-delete-sixty",
    type: "predict_rotation",
    difficulty: 3,
    bloomsLevel: "apply",
    prompt:
      "Delete 60 from this AVL tree. Which rotation fixes it, and which node is the pivot (the lowest unbalanced node)?",
    explanation:
      "Removing 60 leaves 70 as a leaf, so the right subtree of 50 drops to height 1. The left subtree is still height 3, so 50 is +2. Its left child 30 is +1, which is left-left. Rotate 50 right.",
    reviewLesson: "avl-delete",
    hints: [
      "After the delete, walk up from where 60 was.",
      "50 is +2 and 30 leans left too. One rotation is enough.",
    ],
    tree: "50,30,20,10,#,#,#,40,#,#,70,60,#,#,#",
    answer: { type: "predict_rotation", rotation: "right", pivotKey: 50 },
  },
  {
    key: "delete-twenty-even-child",
    type: "build_tree",
    difficulty: 4,
    bloomsLevel: "analyse",
    prompt: "Delete 20 from this AVL tree and rebalance if needed. Build the tree you end up with.",
    explanation:
      "Removing 20 leaves 30 with height 0 on the left and 2 on the right, so 30 is −2. Its right child 40 is 0, with 35 and 50 below it. A child at 0 counts as right-right, so one left rotation at 30 is enough. 40 moves up, and 35, the inner subtree, becomes 30's right child.",
    reviewLesson: "avl-delete",
    hints: [
      "Check 40's balance factor before you pick a rotation.",
      "40 is 0, so rotate 30 left once. Where does 35 go?",
    ],
    tree: "30,20,#,#,40,35,#,#,50,#,#",
    answer: { type: "build_tree", tree: "40,30,#,35,#,#,50,#,#" },
  },
  {
    key: "predict-delete-twenty",
    type: "predict_rotation",
    difficulty: 4,
    bloomsLevel: "apply",
    prompt:
      "Delete 20 from this AVL tree. Which rotation fixes it, and which node is the pivot (the lowest unbalanced node)?",
    explanation:
      "Removing 20 leaves 30 at −2. Its right child 40 has only a left child, 35, so 40 is +1. 30 leans right and 40 leans left, which is right-left. Rotate 40 right, then 30 left, and 35 ends up on top.",
    reviewLesson: "avl-delete",
    hints: [
      "After the delete, check 30 and then its heavy child.",
      "30 leans right but 40 leans left. That needs two rotations.",
    ],
    tree: "30,20,#,#,40,35,#,#,#",
    answer: { type: "predict_rotation", rotation: "rightLeft", pivotKey: 30 },
  },
  {
    key: "delete-needs-two-rotations",
    type: "multiple_choice",
    difficulty: 5,
    bloomsLevel: "evaluate",
    prompt: "Delete 40 from this AVL tree. How many rotations does it take to rebalance the tree?",
    explanation:
      "Removing 40 makes 30 +2 with 20 at +1, so 30 rotates right. That fixes 30's subtree but leaves it one level shorter, height 2. The root 50 now has 2 on the left and 4 on the right, so it is −2, and 70 is −1. 50 rotates left. That's two rotations. An insert never needs more than one fix, but a delete can need one at every level.",
    reviewLesson: "avl-delete",
    hints: [
      "After the first rotation, check whether the subtree got shorter.",
      "After 30 is fixed, look at the root's balance factor again.",
    ],
    tree: "50,30,20,10,#,#,#,40,#,#,70,60,#,65,#,#,80,75,#,#,90,#,95,#,#",
    options: [
      { key: "none", text: "None", isCorrect: false },
      { key: "one", text: "One", isCorrect: false },
      { key: "two", text: "Two", isCorrect: true },
      { key: "three", text: "Three", isCorrect: false },
    ],
  },
  {
    key: "in-order-after-rotation",
    type: "multiple_choice",
    difficulty: 2,
    bloomsLevel: "understand",
    prompt: "You rotate a node in an AVL tree. What happens to the tree's in-order list of keys?",
    explanation:
      "A rotation changes which node is the parent, but every key keeps the same keys on its left and right in sorted order. So the in-order list is the same sorted list before and after.",
    reviewLesson: "in-order",
    hints: [
      "In-order of a search tree always gives the keys in sorted order.",
      "Is the tree still a search tree after a rotation?",
    ],
    options: [
      { key: "same", text: "It stays the same sorted list", isCorrect: true },
      { key: "reversed", text: "It comes out in reverse order", isCorrect: false },
      { key: "two-swap", text: "The two rotated keys swap places", isCorrect: false },
      { key: "new-root-first", text: "The new root moves to the front", isCorrect: false },
    ],
  },
  {
    key: "tap-in-pre-order",
    type: "order_nodes",
    difficulty: 3,
    bloomsLevel: "apply",
    prompt: "Tap the nodes of this tree in pre-order.",
    explanation:
      "Pre-order visits the node, then its left subtree, then its right subtree. That gives 40, then 20, 10, 30, 25 on the left, then 60, 50 on the right.",
    reviewLesson: "pre-order",
    hints: ["The root comes first.", "After 40, finish the whole left subtree: 20, 10, 30, 25."],
    tree: "40,20,10,#,#,30,25,#,#,#,60,50,#,#,#",
    answer: { type: "order_nodes", keys: [40, 20, 10, 30, 25, 60, 50] },
  },
  {
    key: "tap-in-post-order",
    type: "order_nodes",
    difficulty: 3,
    bloomsLevel: "apply",
    prompt: "Tap the nodes of this tree in post-order.",
    explanation:
      "Post-order visits both subtrees before the node. The left subtree gives 20, 45, 40. The right subtree gives 70, 60. The root 50 comes last.",
    reviewLesson: "post-order",
    hints: ["The root comes last.", "The left subtree gives 20, 45, 40."],
    tree: "50,40,20,#,#,45,#,#,60,#,70,#,#",
    answer: { type: "order_nodes", keys: [20, 45, 40, 70, 60, 50] },
  },
  {
    key: "list-in-level-order",
    type: "text",
    difficulty: 2,
    bloomsLevel: "apply",
    prompt:
      "List the keys of this tree in level-order. Type the keys separated by commas, like 1,2,3.",
    explanation:
      "Level-order reads the tree one level at a time, left to right. Level 1 is 40, level 2 is 20, 60, and level 3 is 10, 30, 50, 70.",
    reviewLesson: "level-order",
    hints: ["Read across each level before you go down.", "The second level is 20, 60."],
    tree: "40,20,10,#,#,30,#,#,60,50,#,#,70,#,#",
    accepted: [
      { key: "commas", text: "40,20,60,10,30,50,70" },
      { key: "commas-spaces", text: "40, 20, 60, 10, 30, 50, 70" },
    ],
  },
  {
    key: "heights-use-post-order",
    type: "multiple_choice",
    difficulty: 2,
    bloomsLevel: "understand",
    prompt: "You work out every node's height from the leaves up. Which traversal order is that?",
    explanation:
      "A node's height is 1 plus the larger height of its two subtrees, so you need both subtrees done first. Visiting both subtrees before the node is post-order.",
    reviewLesson: "post-order",
    hints: [
      "What do you need to know before you can work out a node's height?",
      "Which order visits a node after both of its subtrees?",
    ],
    options: [
      { key: "pre-order", text: "Pre-order", isCorrect: false },
      { key: "in-order", text: "In-order", isCorrect: false },
      { key: "post-order", text: "Post-order", isCorrect: true },
      { key: "level-order", text: "Level-order", isCorrect: false },
    ],
  },
] satisfies WrittenQuestionContent[];
