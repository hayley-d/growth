import type { LessonContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  key: "avl-delete",
  unit: "avl-trees",
  position: 5,
  title: "Deleting from an AVL tree",
  summary:
    "Remove a key in one of three cases, then walk back up and fix every node that went out of balance.",
  kind: "lesson",
  notePrompt:
    "Explain in your own words. What are the three delete cases, and why can a delete need more than one rotation?",
  objectives: [
    "Delete a leaf, a node with one child and a node with two children, using the in-order successor for the last",
    "Rebalance every unbalanced node on the path from the deleted node back to the root",
    "Explain why a delete can need more than one rotation when an insert needs at most one",
  ],
} satisfies LessonContent;
