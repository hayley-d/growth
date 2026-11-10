import type { LessonContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  key: "post-order",
  unit: "binary-trees",
  position: 4,
  title: "Post-order",
  summary: "Visit both subtrees first and the node last.",
  kind: "lesson",
  notePrompt:
    "Explain pre-order, in-order and post-order in your own words. Which line of the code moves, and why does postorder(8) stay on the stack while both of its subtrees run?",
  objectives: [
    "List the nodes of a tree in post-order",
    "Explain why deleting a whole tree and working out heights use post-order",
    "Compare pre-order, in-order and post-order on one tree",
  ],
} satisfies LessonContent;
