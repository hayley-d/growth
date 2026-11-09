import type { LessonContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  key: "pre-order",
  unit: "binary-trees",
  position: 2,
  title: "Pre-order",
  summary: "Visit the node first, then its left and right subtrees.",
  kind: "lesson",
  notePrompt:
    "Explain pre-order in your own words. Why does preorder(8) stay on the stack while its left subtree runs?",
  objectives: [
    "List the nodes of a tree in pre-order",
    "Trace the recursive pre-order code and say which calls wait on the call stack",
    "Explain why copying a tree and prefix expressions use pre-order",
  ],
} satisfies LessonContent;
