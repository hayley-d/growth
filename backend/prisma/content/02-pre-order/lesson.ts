import type { LessonContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  key: "pre-order",
  unit: "binary-trees",
  position: 2,
  title: "Pre-order",
  summary: "Visit the node first, then its left and right subtrees.",
  kind: "lesson",
  objectives: ["List the nodes of a tree in pre-order"],
} satisfies LessonContent;
