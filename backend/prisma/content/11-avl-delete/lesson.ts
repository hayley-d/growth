import type { LessonContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  key: "avl-delete",
  unit: "avl-trees",
  position: 5,
  title: "Deleting from an AVL tree",
  summary: "Remove a key, then rebalance every node that went out of balance.",
  kind: "lesson",
  objectives: ["Delete a key from an AVL tree and rebalance it"],
} satisfies LessonContent;
