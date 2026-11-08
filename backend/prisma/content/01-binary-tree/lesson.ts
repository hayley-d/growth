import type { LessonContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  key: "binary-tree",
  unit: "binary-trees",
  position: 1,
  title: "What is a binary tree",
  summary: "Meet nodes, children and the shape of a binary tree.",
  kind: "lesson",
  objectives: ["Name the root, children and leaves of a binary tree"],
} satisfies LessonContent;
