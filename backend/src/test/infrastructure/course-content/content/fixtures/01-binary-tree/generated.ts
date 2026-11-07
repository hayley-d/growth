import type { GeneratedQuestionContent } from "@/infrastructure/course-content/content/content-schema";

export default [
  {
    key: "pre-order-easy",
    generatorKey: "traversal-order",
    generatorOptions: { order: "preorder" },
    type: "order_nodes",
    difficulty: 1,
    bloomsLevel: "apply",
    reviewLesson: "binary-tree",
  },
] satisfies GeneratedQuestionContent[];
