import type { LessonContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  key: "single-rotations",
  unit: "avl-trees",
  position: 2,
  title: "Single rotations",
  summary: "Fix a left-left or right-right imbalance with one rotation.",
  kind: "lesson",
  objectives: ["Fix a left-left or right-right imbalance with one rotation"],
} satisfies LessonContent;
