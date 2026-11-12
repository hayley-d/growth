import type { LessonContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  key: "avl-insert",
  unit: "avl-trees",
  position: 4,
  title: "Inserting into an AVL tree",
  summary:
    "Insert like in a plain search tree, walk back up updating heights, then fix the first unbalanced node.",
  kind: "lesson",
  notePrompt:
    "Explain in your own words. What are the three parts of an AVL insert, and how do you pick the rotation?",
  objectives: [
    "Insert a key as in a binary search tree, then update the heights on the way back up to the root",
    "Find the lowest unbalanced node after an insert and name its imbalance case",
    "Explain why one rotation, single or double, is enough to rebalance the tree after an insert",
  ],
} satisfies LessonContent;
