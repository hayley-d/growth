import type { LessonContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  key: "binary-tree",
  unit: "traversal",
  position: 1,
  title: "What is a binary tree",
  summary: "Nodes, children and the root.",
  kind: "lesson",
  notePrompt: "Explain a binary tree in your own words.",
  objectives: ["Name the parts of a binary tree"],
} satisfies LessonContent;
