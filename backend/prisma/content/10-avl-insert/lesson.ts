import type { LessonContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  key: "avl-insert",
  unit: "avl-trees",
  position: 4,
  title: "Inserting into an AVL tree",
  summary: "Insert a key, then rebalance on the way back up.",
  kind: "lesson",
  objectives: ["Insert a key into an AVL tree and rebalance it"],
} satisfies LessonContent;
