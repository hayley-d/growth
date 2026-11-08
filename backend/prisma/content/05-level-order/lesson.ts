import type { LessonContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  key: "level-order",
  unit: "binary-trees",
  position: 5,
  title: "Level-order",
  summary: "Visit the tree one level at a time, from the top down.",
  kind: "lesson",
  objectives: ["List the nodes of a tree in level-order"],
} satisfies LessonContent;
