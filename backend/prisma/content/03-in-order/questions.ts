import type { WrittenQuestionContent } from "@/infrastructure/course-content/content/content-schema";

export default [
  {
    key: "tap-in-in-order",
    type: "order_nodes",
    difficulty: 2,
    bloomsLevel: "apply",
    prompt: "Tap the nodes of this tree in in-order.",
    explanation:
      "In-order visits the left subtree, then the node, then the right subtree. That gives 2, 4, 6, then 8, then 10, 12, 14.",
    reviewLesson: "in-order",
    hints: [
      "Go as far left as you can first.",
      "The root, 8, comes after its whole left subtree.",
      "In a search tree the answer is sorted.",
    ],
    tree: "8,4,2,#,#,6,#,#,12,10,#,#,14,#,#",
    answer: { type: "order_nodes", keys: [2, 4, 6, 8, 10, 12, 14] },
  },
  {
    key: "visit-line",
    type: "multiple_choice",
    difficulty: 1,
    bloomsLevel: "remember",
    prompt:
      "After the empty check, in-order does three things: visit(node), inorder(node.left) and inorder(node.right). Which position is visit(node) in?",
    explanation:
      "In-order visits between the two calls. It goes left first, then visits, then goes right, so visit(node) is 2nd.",
    reviewLesson: "in-order",
    hints: ["In-order visits between the two calls.", "The left call comes first."],
    options: [
      { key: "first", text: "1st, before both calls", isCorrect: false },
      { key: "second", text: "2nd, between the calls", isCorrect: true },
      { key: "third", text: "3rd, after both calls", isCorrect: false },
    ],
  },
  {
    key: "why-sorted",
    type: "multiple_choice",
    difficulty: 2,
    bloomsLevel: "understand",
    prompt: "Why does in-order give the keys of a search tree in sorted order?",
    explanation:
      "Everything in a node's left subtree is smaller and everything in its right subtree is bigger. In-order visits the smaller keys, then the node, then the bigger keys.",
    reviewLesson: "in-order",
    hints: [
      "Where are the smaller keys in a search tree?",
      "In-order visits the left subtree before the node.",
    ],
    options: [
      {
        key: "left-smaller",
        text: "Smaller keys are on the left, and in-order visits the left side before the node",
        isCorrect: true,
      },
      { key: "root-smallest", text: "The root is always the smallest key", isCorrect: false },
      { key: "levels", text: "In-order visits the tree one level at a time", isCorrect: false },
      { key: "sorts", text: "The code sorts the keys after visiting them", isCorrect: false },
    ],
  },
  {
    key: "stack-when-ten-is-visited",
    type: "multiple_choice",
    difficulty: 3,
    bloomsLevel: "analyse",
    prompt: "In-order runs on this tree. What is on the stack when 10 is visited?",
    explanation:
      "inorder(20) called inorder(10) at line 3 and waits there. inorder(10) is running and visits 10, because its left child is empty.",
    reviewLesson: "in-order",
    hints: [
      "20 hasn't been visited yet when 10 is.",
      "A call waits on the line that made the next call.",
    ],
    tree: "20,10,#,#,30,#,#",
    options: [
      {
        key: "twenty-waits-at-three",
        text: "inorder(10) running, inorder(20) waiting at line 3",
        isCorrect: true,
      },
      {
        key: "twenty-waits-at-four",
        text: "inorder(10) running, inorder(20) waiting at line 4",
        isCorrect: false,
      },
      { key: "ten-only", text: "inorder(10) running, nothing waiting", isCorrect: false },
      {
        key: "thirty-waits",
        text: "inorder(10) running, inorder(30) waiting at line 3",
        isCorrect: false,
      },
    ],
  },
  {
    key: "write-in-order",
    type: "text",
    difficulty: 2,
    bloomsLevel: "apply",
    prompt: "Write this tree's keys in in-order, with a comma and a space between each.",
    explanation:
      "In a search tree, in-order gives the keys from smallest to biggest: 30, 40, 50, 60, 70.",
    reviewLesson: "in-order",
    hints: ["Start with the left subtree of 50.", "The answer is sorted."],
    tree: "50,30,#,40,#,#,70,60,#,#,#",
    accepted: [
      { key: "commas-and-spaces", text: "30, 40, 50, 60, 70" },
      { key: "commas", text: "30,40,50,60,70" },
      { key: "spaces", text: "30 40 50 60 70" },
    ],
  },
] satisfies WrittenQuestionContent[];
