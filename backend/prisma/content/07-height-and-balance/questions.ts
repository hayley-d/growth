import type { WrittenQuestionContent } from "@/infrastructure/course-content/content/content-schema";

export default [
  {
    key: "why-stick-is-slow",
    type: "multiple_choice",
    difficulty: 1,
    bloomsLevel: "understand",
    prompt:
      "You insert the keys 1, 2, 3, 4 into a plain binary search tree with no rebalancing. Why can search become O(n)?",
    explanation:
      "Sorted inserts with no rebalancing make a stick: each new key hangs under the previous one. Search then walks every node on that line, so it takes time proportional to n, not log n.",
    reviewLesson: "height-and-balance",
    hints: [
      "Draw what the tree looks like after inserting 1, then 2, then 3, then 4.",
      "How many nodes does a search for 4 visit?",
    ],
    options: [
      {
        key: "stick-path",
        text: "The tree becomes a line, so a search may walk every node",
        isCorrect: true,
      },
      {
        key: "hashing",
        text: "Binary search trees always hash the keys first",
        isCorrect: false,
      },
      {
        key: "sorted-faster",
        text: "Sorted keys make every search finish in one step",
        isCorrect: false,
      },
      {
        key: "extra-array",
        text: "The tree also stores an unsorted array that search must scan",
        isCorrect: false,
      },
    ],
  },
  {
    key: "height-of-tree",
    type: "text",
    difficulty: 2,
    bloomsLevel: "apply",
    prompt: "What is the height of this tree? A leaf has height 1 and an empty tree has height 0.",
    explanation:
      "The longest path down from 20 is 20 → 10 → 5. That path has 3 nodes, so the height is 3.",
    reviewLesson: "height-and-balance",
    hints: [
      "Height counts the nodes on the longest path down to a leaf.",
      "The height of a node is 1 plus the larger height of its two subtrees.",
    ],
    tree: "20,10,5,#,#,#,30,#,#",
    accepted: [
      { key: "three", text: "3" },
      { key: "three-word", text: "three" },
    ],
  },
  {
    key: "balance-factor-of-twenty",
    type: "text",
    difficulty: 2,
    bloomsLevel: "apply",
    prompt:
      "What is the balance factor of node 20? Balance factor is the height of the left subtree minus the height of the right subtree. A leaf has height 1 and an empty subtree has height 0.",
    explanation:
      "The left subtree of 20 is rooted at 10 and has height 2. The right subtree is the leaf 30, height 1. So the balance factor is 2 − 1 = 1.",
    reviewLesson: "height-and-balance",
    hints: [
      "Work out the height of the left and right subtree of 20 separately.",
      "A missing subtree counts as height 0, and a leaf has height 1.",
    ],
    tree: "20,10,5,#,#,#,30,#,#",
    accepted: [
      { key: "one", text: "1" },
      { key: "plus-one", text: "+1" },
    ],
  },
  {
    key: "avl-rule-check",
    type: "multiple_choice",
    difficulty: 2,
    bloomsLevel: "understand",
    prompt: "Which statement is the AVL balance rule?",
    explanation:
      "An AVL tree is a binary search tree where every node's balance factor is -1, 0 or 1. That keeps the two sides of every node within one level of each other.",
    reviewLesson: "height-and-balance",
    hints: [
      "Balance factor is left height minus right height.",
      "The rule talks about every node, not only the root.",
    ],
    options: [
      {
        key: "every-bf",
        text: "Every node has a balance factor of -1, 0 or 1",
        isCorrect: true,
      },
      {
        key: "root-only",
        text: "Only the root needs a balance factor of 0",
        isCorrect: false,
      },
      {
        key: "left-taller",
        text: "The left subtree must always be taller than the right",
        isCorrect: false,
      },
      {
        key: "height-two",
        text: "No leaf may have height greater than 2",
        isCorrect: false,
      },
    ],
  },
  {
    key: "stick-not-avl",
    type: "multiple_choice",
    difficulty: 3,
    bloomsLevel: "analyse",
    prompt:
      "This tree came from inserting 1, 2, 3, 4 into a plain binary search tree with no rebalancing. Is it a valid AVL tree?",
    explanation:
      "Node 1 has balance factor 0 − 3 = −3, and node 2 has balance factor −2. Both sit outside −1 to 1, so the tree is not a valid AVL tree.",
    reviewLesson: "height-and-balance",
    hints: [
      "Write each node's height from the leaves up, then subtract right height from left.",
      "Check every node, not only the root.",
    ],
    tree: "1,#,2,#,3,#,4,#,#",
    options: [
      {
        key: "yes-bst",
        text: "Yes, because it is still a binary search tree",
        isCorrect: false,
      },
      {
        key: "no-bf",
        text: "No, at least one node has a balance factor outside -1 to 1",
        isCorrect: true,
      },
      {
        key: "yes-four",
        text: "Yes, because it has only four nodes",
        isCorrect: false,
      },
      {
        key: "no-sorted",
        text: "No, because the keys are in sorted order",
        isCorrect: false,
      },
    ],
  },
] satisfies WrittenQuestionContent[];
