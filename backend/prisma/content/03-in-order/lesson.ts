import type { LessonContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  key: "in-order",
  unit: "binary-trees",
  position: 3,
  title: "In-order",
  summary: "Visit the left subtree, then the node, then the right subtree.",
  kind: "lesson",
  notePrompt:
    "Explain in-order in your own words. Why does in-order give the keys of a search tree from smallest to biggest?",
  objectives: [
    "List the nodes of a tree in in-order",
    "Say which line of the pre-order code moves to make in-order",
    "Explain why the in-order of a search tree gives its keys in sorted order",
  ],
} satisfies LessonContent;
