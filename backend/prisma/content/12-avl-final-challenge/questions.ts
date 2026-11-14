import type { WrittenQuestionContent } from "@/infrastructure/course-content/content/content-schema";

export default [
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
      "Work out the balance factor of each node, starting from the leaves.",
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
    key: "balanced-but-not-a-search-tree",
    type: "multiple_choice",
    difficulty: 4,
    bloomsLevel: "evaluate",
    prompt:
      "Sam rebalanced a tree by hand and got this one. Every node has a balance factor of -1, 0 or 1. Is it a valid AVL tree?",
    explanation:
      "An AVL tree has to be a search tree first. 30 sits in the right subtree of 40, but 30 is smaller than 40. Read it in in-order and you get 10, 20, 40, 30, 60, 80, which isn't sorted. A correct rotation never changes the in-order order, so Sam put a subtree on the wrong side.",
    reviewLesson: "single-rotations",
    hints: [
      "Balance is only half of the AVL rule.",
      "Read the keys in in-order. Do they come out sorted?",
    ],
    tree: "40,20,10,#,#,#,60,30,#,#,80,#,#",
    options: [
      { key: "yes-balanced", text: "Yes, every balance factor is allowed", isCorrect: false },
      {
        key: "no-order",
        text: "No, 30 is in the right subtree of 40, so it isn't a search tree",
        isCorrect: true,
      },
      { key: "no-root", text: "No, the root's balance factor must be 0", isCorrect: false },
      { key: "no-leaves", text: "No, all the leaves must be on the same level", isCorrect: false },
    ],
  },
  {
    key: "fewest-nodes-height-three",
    type: "multiple_choice",
    difficulty: 4,
    bloomsLevel: "analyse",
    prompt:
      "What is the smallest number of nodes an AVL tree of height 3 can have? A leaf has height 1.",
    explanation:
      "Three nodes in a line have height 3, but the top node then has balance factor 2 or −2. To stay legal, the root needs one subtree of height 2 (two nodes) and the other of height at least 1 (one node). That gives 1 + 2 + 1 = 4 nodes.",
    reviewLesson: "height-and-balance",
    hints: [
      "Try to build the thinnest tree of height 3 that still follows the AVL rule.",
      "If one subtree of the root has height 2, how short can the other one be?",
    ],
    options: [
      { key: "three", text: "3", isCorrect: false },
      { key: "four", text: "4", isCorrect: true },
      { key: "five", text: "5", isCorrect: false },
      { key: "seven", text: "7", isCorrect: false },
    ],
  },
  {
    key: "what-every-shape-shares",
    type: "multiple_choice",
    difficulty: 4,
    bloomsLevel: "analyse",
    prompt:
      "An AVL tree holds the keys 10, 20, 30, 40, 50, 60 and 70. You don't know its shape. Which statement must be true?",
    explanation:
      "Every search tree gives its keys in sorted order in in-order, so the in-order list is 10 to 70 whatever the shape. The others depend on the shape. An AVL tree with these keys can have 50 at the root and height 4, with 30, 20, 10, 40 on the left and 60, 70 on the right, so 40 isn't always the root and the tree isn't always perfect. And 10 can never be the root, because its left side would be empty and its right side at least three levels tall.",
    reviewLesson: "in-order",
    hints: [
      "Look for the statement that holds for every legal shape, not just the neatest one.",
      "Which traversal gives the same list for every search tree with the same keys?",
    ],
    options: [
      {
        key: "in-order-sorted",
        text: "Its in-order list is 10, 20, 30, 40, 50, 60, 70",
        isCorrect: true,
      },
      { key: "middle-root", text: "40 is the root, because it's the middle key", isCorrect: false },
      { key: "perfect", text: "It is a perfect tree of height 3", isCorrect: false },
      {
        key: "pre-order-sorted",
        text: "Its pre-order list is 10, 20, 30, 40, 50, 60, 70",
        isCorrect: false,
      },
    ],
  },
  {
    key: "sorted-keys-plain-and-avl",
    type: "multiple_choice",
    difficulty: 3,
    bloomsLevel: "understand",
    prompt:
      "You insert the keys 1 to 15 in order into a plain binary search tree, and then into an AVL tree. What height does each tree end up with?",
    explanation:
      "The plain tree never rebalances, so every key hangs right of the one before and you get a stick of height 15. The AVL tree rotates as it goes and ends up as a perfect tree of height 4. A search in the plain tree can walk 15 nodes, but only 4 in the AVL tree.",
    reviewLesson: "height-and-balance",
    hints: [
      "Draw the plain tree after the first four keys. What shape is it making?",
      "A perfect tree of height h holds 2^h − 1 keys.",
    ],
    options: [
      { key: "fifteen-four", text: "Plain: 15, AVL: 4", isCorrect: true },
      { key: "fifteen-fifteen", text: "Plain: 15, AVL: 15", isCorrect: false },
      { key: "eight-four", text: "Plain: 8, AVL: 4", isCorrect: false },
      { key: "four-four", text: "Plain: 4, AVL: 4", isCorrect: false },
    ],
  },
  {
    key: "balance-after-double",
    type: "text",
    difficulty: 4,
    bloomsLevel: "apply",
    prompt:
      "Insert 25 into this AVL tree and rebalance. What is the balance factor of 50 afterwards?",
    explanation:
      "25 goes left of 30. 20 is then −1 and 50 is +2, so it's left-right at 50. Rotate 20 left, then 50 right, and 30 ends up on top. 50 keeps 60 on its right and gets 30's old right side, which is empty, on its left. So 50 has balance factor 0 − 1 = −1.",
    reviewLesson: "double-rotations",
    hints: [
      "Rebalance first, then work out heights in the new tree.",
      "Find where 30's old right subtree goes during the second rotation.",
    ],
    tree: "50,20,10,#,#,30,#,#,60,#,#",
    accepted: [
      { key: "minus-one", text: "-1" },
      { key: "minus-sign-one", text: "−1" },
    ],
  },
  {
    key: "which-insert-double",
    type: "multiple_choice",
    difficulty: 4,
    bloomsLevel: "analyse",
    prompt:
      "Start with an empty AVL tree. Insert 30, 10, 20, 40 and 50 in that order, rebalancing after each one. Which insert needs a double rotation?",
    explanation:
      "After 30 and 10, inserting 20 puts it right of 10. 30 is then +2 and 10 is −1, which is left-right, so it needs two rotations and 20 becomes the root. 40 needs nothing. 50 makes 30 right-right, which needs only one left rotation.",
    reviewLesson: "double-rotations",
    hints: [
      "Draw the tree after every insert and rebalance straight away.",
      "A double rotation is needed when the node and its taller child lean opposite ways.",
    ],
    options: [
      { key: "ten", text: "Inserting 10", isCorrect: false },
      { key: "twenty", text: "Inserting 20", isCorrect: true },
      { key: "forty", text: "Inserting 40", isCorrect: false },
      { key: "fifty", text: "Inserting 50", isCorrect: false },
    ],
  },
  {
    key: "post-order-after-insert",
    type: "text",
    difficulty: 5,
    bloomsLevel: "apply",
    prompt:
      "Insert 27 into this AVL tree and rebalance. Then list the keys of the new tree in post-order. Type the keys separated by commas, like 1,2,3.",
    explanation:
      "27 goes right of 25. 20 is then −1 and 30 is +2, so it's left-right at 30. Rotate 20 left, then 30 right. 25 becomes the root, with 20 and 10 on its left and 30, 27 and 40 on its right. Post-order visits both subtrees before the node: 10, 20, then 27, 40, 30, and 25 last.",
    reviewLesson: "double-rotations",
    hints: [
      "Rebalance first, and only then do the traversal.",
      "In post-order the root of the new tree comes last.",
    ],
    tree: "30,20,10,#,#,25,#,#,40,#,#",
    accepted: [{ key: "post-order", text: "10,20,27,40,30,25" }],
  },
  {
    key: "pre-order-after-insert",
    type: "text",
    difficulty: 4,
    bloomsLevel: "apply",
    prompt:
      "Insert 75 into this AVL tree and rebalance. Then list the keys of the new tree in pre-order. Type the keys separated by commas, like 1,2,3.",
    explanation:
      "75 goes left of 80. Walking back up, 70 is the first node at −2, and its right child 80 is +1, so it's right-left at 70. Rotate 80 right, then 70 left, and 75 takes 70's place with 70 and 80 below it. Nothing else moves. Pre-order then gives 40, 20, 10, 30, 60, 50, 75, 70, 80.",
    reviewLesson: "avl-insert",
    hints: [
      "Fix the lowest unbalanced node, then check nothing above it is still out.",
      "Only the subtree under the lowest unbalanced node changes shape.",
    ],
    tree: "40,20,10,#,#,30,#,#,60,50,#,#,70,#,80,#,#",
    accepted: [{ key: "pre-order", text: "40,20,10,30,60,50,75,70,80" }],
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
      "Two of the five inserts need a fix.",
    ],
    tree: "#",
    answer: { type: "build_tree", tree: "20,10,#,#,40,30,#,#,50,#,#" },
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
      "Rebalance after every insert, not only at the end.",
      "Not every fix in this sequence is a single rotation.",
    ],
    tree: "#",
    answer: { type: "build_tree", tree: "20,10,#,#,28,25,#,#,30,#,#" },
  },
  {
    key: "height-after-inserts",
    type: "text",
    difficulty: 4,
    bloomsLevel: "apply",
    prompt:
      "Start with an empty AVL tree. Insert 50, 40, 30, 35, 45, 20 and 25 in that order, rebalancing after each one. What is the height of the tree at the end? A leaf has height 1.",
    explanation:
      "Inserting 30 makes 50 left-left, so 50 rotates right and 40 becomes the root. After that no insert needs a fix. 35 goes right of 30, 45 goes left of 50, and 20 goes left of 30. 25 goes right of 20, which leaves 20 at −1, 30 at +1 and 40 at +1. The longest path is 40, 30, 20, 25, so the height is 4.",
    reviewLesson: "avl-insert",
    hints: [
      "Draw the tree after every insert and rebalance straight away.",
      "Count the nodes on the longest path from the root down to a leaf.",
    ],
    accepted: [
      { key: "four", text: "4" },
      { key: "four-word", text: "four" },
    ],
  },
  {
    key: "which-insert-rotates",
    type: "multiple_choice",
    difficulty: 4,
    bloomsLevel: "analyse",
    prompt: "You insert one of these keys into this AVL tree. Which one makes the tree rotate?",
    explanation:
      "5 goes left of 10. Then 20 has a left subtree of height 2 and nothing on the right, so it is +2 and needs a right rotation. 30 lands next to 10 under 20, and 55 and 75 land under 60, which already has two children of the same height. None of those three pushes a node past −1 or 1.",
    reviewLesson: "avl-insert",
    hints: [
      "Only the nodes on the path from the new key back to the root can change.",
      "Look for a node that already leans one way, then add to its taller side.",
    ],
    tree: "40,20,10,#,#,#,60,50,#,#,70,#,#",
    options: [
      { key: "five", text: "5", isCorrect: true },
      { key: "thirty", text: "30", isCorrect: false },
      { key: "fifty-five", text: "55", isCorrect: false },
      { key: "seventy-five", text: "75", isCorrect: false },
    ],
  },
  {
    key: "heights-climb-like-post-order",
    type: "multiple_choice",
    difficulty: 3,
    bloomsLevel: "understand",
    prompt:
      "An AVL insert updates each node's height on the way back up, after the recursive call for its child returns. Which traversal also handles the children before their parent?",
    explanation:
      "A node's height is 1 plus the larger height of its children, so the children have to be done first. Post-order visits both subtrees before the node, which is the same bottom-up order the insert uses when it updates heights.",
    reviewLesson: "post-order",
    hints: [
      "What do you need to know before you can work out a node's height?",
      "Think about where the visit sits in each traversal's code, before or after the recursive calls.",
    ],
    options: [
      { key: "pre-order", text: "Pre-order", isCorrect: false },
      { key: "in-order", text: "In-order", isCorrect: false },
      { key: "post-order", text: "Post-order", isCorrect: true },
      { key: "level-order", text: "Level-order", isCorrect: false },
    ],
  },
  {
    key: "level-order-after-delete",
    type: "text",
    difficulty: 4,
    bloomsLevel: "apply",
    prompt:
      "Delete 60 from this AVL tree and rebalance. Then list the keys of the new tree in level-order. Type the keys separated by commas, like 1,2,3.",
    explanation:
      "60 is a leaf, so it just goes. 70 then has nothing on its left and 80 → 90 on its right, so it is −2, and 80 is −1. That is right-right, so 70 rotates left and 80 takes its place. Level-order reads each level left to right: 50, then 30, 80, then 20, 40, 70, 90.",
    reviewLesson: "avl-delete",
    hints: [
      "Rebalance first, and only then do the traversal.",
      "Walk up from where 60 was and check each balance factor.",
    ],
    tree: "50,30,20,#,#,40,#,#,70,60,#,#,80,#,90,#,#",
    accepted: [{ key: "level-order", text: "50,30,80,20,40,70,90" }],
  },
  {
    key: "height-after-delete",
    type: "text",
    difficulty: 4,
    bloomsLevel: "apply",
    prompt:
      "Delete 60 from this AVL tree and rebalance. What is the height of the tree afterwards? A leaf has height 1.",
    explanation:
      "Removing 60 leaves 70 as a leaf, so 50 has height 3 on the left and 1 on the right. That is +2, and 30 is +1, so 50 rotates right and 30 becomes the root. The tree is 30 with 20 and 10 on the left and 50, 40, 70 on the right. Its longest path is 30, 20, 10, so the height is 3, one less than before.",
    reviewLesson: "avl-delete",
    hints: [
      "Rebalance first, then count.",
      "A rotation after a delete can make the whole tree shorter.",
    ],
    tree: "50,30,20,10,#,#,#,40,#,#,70,60,#,#,#",
    accepted: [
      { key: "three", text: "3" },
      { key: "three-word", text: "three" },
    ],
  },
  {
    key: "which-delete-rotates",
    type: "multiple_choice",
    difficulty: 4,
    bloomsLevel: "analyse",
    prompt: "You delete one of these keys from this AVL tree. Which one makes the tree rotate?",
    explanation:
      "40 already leans right, at −1. Deleting 20 empties its left side, so 40 drops to −2 and needs a left rotation at 40. Deleting 50, 60 or 70 takes a key from the taller right side but leaves it two levels tall, so 40 stays at −1 and nothing rotates.",
    reviewLesson: "avl-delete",
    hints: [
      "Work out which way the root leans before anything is deleted.",
      "Taking a key from the shorter side makes the lean worse.",
    ],
    tree: "40,20,#,#,60,50,#,#,70,#,#",
    options: [
      { key: "twenty", text: "20", isCorrect: true },
      { key: "fifty", text: "50", isCorrect: false },
      { key: "sixty", text: "60", isCorrect: false },
      { key: "seventy", text: "70", isCorrect: false },
    ],
  },
  {
    key: "insert-then-delete-root",
    type: "text",
    difficulty: 4,
    bloomsLevel: "apply",
    prompt:
      "Insert 5 into this AVL tree and rebalance. Then delete 30 and rebalance again. Which key is at the root at the end?",
    explanation:
      "5 goes left of 10, which leaves 20 at +1, so no fix is needed. Deleting 30 leaves 20 with height 2 on the left and nothing on the right. That is +2, and 10 is +1, so 20 rotates right and 10 becomes the root, with 5 and 20 as its children.",
    reviewLesson: "single-rotations",
    hints: [
      "Do the two changes one at a time, rebalancing after each.",
      "After the delete, check which way the root leans and which way its taller child leans.",
    ],
    tree: "20,10,#,#,30,#,#",
    accepted: [
      { key: "ten", text: "10" },
      { key: "ten-word", text: "ten" },
    ],
  },
  {
    key: "predecessor-instead",
    type: "multiple_choice",
    difficulty: 4,
    bloomsLevel: "evaluate",
    prompt:
      "Thandi deletes 40 from this AVL tree, but she puts 30, the largest key in its left subtree, in its place instead of the in-order successor. Is her tree still a valid AVL tree?",
    explanation:
      "Yes. 30 is bigger than everything left of it and smaller than everything right of it, so the keys stay in order. Her tree is 30 with 20 and 10 on the left and 60, 50, 70 on the right, and every balance factor is between -1 and 1. It is a different tree from the one this course builds with the successor, so it wouldn't match our answer, but it isn't wrong.",
    reviewLesson: "avl-delete",
    hints: [
      "Check two things: are the keys in order, and is every node balanced?",
      "Compare 30 with every key left of it and every key right of it.",
    ],
    tree: "40,20,10,#,#,30,#,#,60,50,#,#,70,#,#",
    options: [
      {
        key: "yes-valid",
        text: "Yes, the keys stay in order and every node is balanced",
        isCorrect: true,
      },
      { key: "no-order", text: "No, the keys are no longer in search order", isCorrect: false },
      { key: "no-balance", text: "No, 20 ends up with balance factor 2", isCorrect: false },
      {
        key: "no-successor",
        text: "No, a node with two children can only be replaced by its successor",
        isCorrect: false,
      },
    ],
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
      "After a rotation, check whether the subtree got shorter.",
      "Keep checking balance factors all the way up to the root.",
    ],
    tree: "50,30,20,10,#,#,#,40,#,#,70,60,#,65,#,#,80,75,#,#,90,#,95,#,#",
    options: [
      { key: "none", text: "None", isCorrect: false },
      { key: "one", text: "One", isCorrect: false },
      { key: "two", text: "Two", isCorrect: true },
      { key: "three", text: "Three", isCorrect: false },
    ],
  },
] satisfies WrittenQuestionContent[];
