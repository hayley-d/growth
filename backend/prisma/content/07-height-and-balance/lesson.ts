import type { LessonContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  key: "height-and-balance",
  unit: "avl-trees",
  position: 1,
  title: "Height and balance factor",
  summary: "Work out how tall each node is and when a tree is out of balance.",
  kind: "lesson",
  objectives: ["Work out the height and balance factor of each node"],
} satisfies LessonContent;
