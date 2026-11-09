import type { WrittenQuestionContent } from "@/infrastructure/course-content/content/content-schema";

export default [
  {
    key: "tap-in-pre-order",
    type: "order_nodes",
    difficulty: 2,
    bloomsLevel: "apply",
    prompt: "Tap the nodes of this tree in pre-order.",
    explanation:
      "Pre-order visits the node, then its whole left subtree, then its right subtree. So 8 comes first, then 4, 2 and 6, then 12, 10 and 14.",
    reviewLesson: "pre-order",
    hints: [
      "Start at the root.",
      "Finish everything under 4 before you go to 12.",
      "The left subtree gives 4, 2, 6.",
    ],
    tree: "8,4,2,#,#,6,#,#,12,10,#,#,14,#,#",
    answer: { type: "order_nodes", keys: [8, 4, 2, 6, 12, 10, 14] },
  },
  {
    key: "stack-when-six-is-visited",
    type: "multiple_choice",
    difficulty: 3,
    bloomsLevel: "analyse",
    prompt: "Pre-order runs on this tree. Which calls are on the stack when 6 is visited?",
    explanation:
      "preorder(8) and preorder(4) are both waiting for their left subtree to finish, and preorder(6) is running. preorder(2) has already returned.",
    reviewLesson: "pre-order",
    hints: [
      "A call stays on the stack until it's finished.",
      "preorder(2) is done before preorder(4) goes right.",
    ],
    tree: "8,4,2,#,#,6,#,#,12,10,#,#,14,#,#",
    options: [
      { key: "eight-four-six", text: "preorder(8), preorder(4), preorder(6)", isCorrect: true },
      {
        key: "eight-four-two-six",
        text: "preorder(8), preorder(4), preorder(2), preorder(6)",
        isCorrect: false,
      },
      { key: "six-only", text: "preorder(6)", isCorrect: false },
      { key: "four-six", text: "preorder(4), preorder(6)", isCorrect: false },
    ],
  },
  {
    key: "waiting-line",
    type: "multiple_choice",
    difficulty: 2,
    bloomsLevel: "understand",
    prompt:
      "preorder(20) has visited 20 and called preorder(10). Which line is preorder(20) paused at?",
    explanation:
      "Line 4 is preorder(node.left). preorder(20) waits there until preorder(10) returns, then carries on at line 5.",
    reviewLesson: "pre-order",
    hints: [
      "Which line makes the call on the left child?",
      "Line 3 visits, lines 4 and 5 make the calls.",
    ],
    tree: "20,10,#,#,30,#,#",
    options: [
      { key: "line-two", text: "Line 2: if node is empty: return", isCorrect: false },
      { key: "line-three", text: "Line 3: visit(node)", isCorrect: false },
      { key: "line-four", text: "Line 4: preorder(node.left)", isCorrect: true },
      { key: "line-five", text: "Line 5: preorder(node.right)", isCorrect: false },
    ],
  },
  {
    key: "why-copy-uses-pre-order",
    type: "multiple_choice",
    difficulty: 2,
    bloomsLevel: "understand",
    prompt: "Why do we copy a tree in pre-order?",
    explanation:
      "A node can only be added under its parent. Pre-order visits each parent before its children, so the parent is always in the copy already.",
    reviewLesson: "pre-order",
    hints: ["Where does a new node go in the copy?", "What has to be there before a child?"],
    options: [
      {
        key: "parent-first",
        text: "Each parent has to be in the copy before its children",
        isCorrect: true,
      },
      { key: "sorted", text: "Pre-order gives the keys in sorted order", isCorrect: false },
      { key: "leaves-first", text: "The leaves have to be copied first", isCorrect: false },
      { key: "fewer-steps", text: "Pre-order visits fewer nodes", isCorrect: false },
    ],
  },
  {
    key: "prefix-form",
    type: "text",
    difficulty: 3,
    bloomsLevel: "apply",
    prompt:
      "An expression tree has + at the root. Its left child is × with 2 and 3 below it, and its right child is 4. Write it in prefix, with a space between each part.",
    explanation:
      "Pre-order visits +, then the left subtree × 2 3, then 4. So the prefix form is + × 2 3 4.",
    reviewLesson: "pre-order",
    hints: ["Each operator comes before its two values.", "Start with the root, +."],
    accepted: [
      { key: "times-sign", text: "+ × 2 3 4" },
      { key: "asterisk", text: "+ * 2 3 4" },
    ],
  },
] satisfies WrittenQuestionContent[];
