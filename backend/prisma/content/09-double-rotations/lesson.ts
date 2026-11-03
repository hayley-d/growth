import type { LessonContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  key: "double-rotations",
  unit: "avl-trees",
  position: 3,
  title: "Double rotations",
  summary: "Fix a left-right or right-left imbalance with two rotations.",
  kind: "lesson",
  objectives: ["Fix a left-right or right-left imbalance with two rotations"],
} satisfies LessonContent;
