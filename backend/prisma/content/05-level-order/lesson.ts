import type { LessonContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  key: "level-order",
  unit: "binary-trees",
  position: 5,
  title: "Level-order",
  summary: "Visit the tree one level at a time, from the top down.",
  kind: "lesson",
  notePrompt:
    "Explain level-order in your own words. Why does it need a queue, and how is that different from the call stack in the depth-first orders?",
  objectives: [
    "List the nodes of a tree in level-order",
    "Explain why level-order uses a queue and a loop instead of recursion",
    "Compare level-order with pre-order, in-order and post-order on one tree",
  ],
} satisfies LessonContent;
