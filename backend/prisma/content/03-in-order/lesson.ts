import type { LessonContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  key: "in-order",
  unit: "binary-trees",
  position: 3,
  title: "In-order",
  summary: "Visit the left subtree, then the node, then the right subtree.",
  kind: "lesson",
  objectives: ["List the nodes of a tree in in-order"],
} satisfies LessonContent;
