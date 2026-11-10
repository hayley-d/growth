import type { LessonContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  key: "binary-tree",
  unit: "binary-trees",
  position: 1,
  title: "What is a binary tree",
  summary: "Learn the words for a binary tree and the rule that keeps a search tree in order.",
  kind: "lesson",
  notePrompt:
    "Explain what a binary search tree is in your own words. Use the words root, leaf and subtree, and say where a new key goes.",
  objectives: [
    "Name the root, parents, children and leaves of a binary tree",
    "Say what a subtree is and find the left and right subtree of a node",
    "Work out the depth and the height of a node",
    "Insert keys into a binary search tree by going left for smaller keys and right for bigger ones",
  ],
} satisfies LessonContent;
