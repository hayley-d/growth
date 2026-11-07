import type { LessonContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  key: "post-order",
  unit: "binary-trees",
  position: 4,
  title: "Post-order",
  summary: "Visit both subtrees first and the node last.",
  kind: "lesson",
  objectives: ["List the nodes of a tree in post-order"],
} satisfies LessonContent;
