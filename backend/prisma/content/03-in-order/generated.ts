import type { GeneratedQuestionContent } from "@/infrastructure/course-content/content/content-schema";

export default [
  {
    key: "in-order-easy",
    generatorKey: "traversal-order",
    generatorOptions: { order: "inorder" },
    type: "order_nodes",
    difficulty: 1,
    bloomsLevel: "apply",
    reviewLesson: "in-order",
  },
  {
    key: "in-order-medium",
    generatorKey: "traversal-order",
    generatorOptions: { order: "inorder" },
    type: "order_nodes",
    difficulty: 2,
    bloomsLevel: "apply",
    reviewLesson: "in-order",
  },
  {
    key: "in-order-hard",
    generatorKey: "traversal-order",
    generatorOptions: { order: "inorder" },
    type: "order_nodes",
    difficulty: 3,
    bloomsLevel: "apply",
    reviewLesson: "in-order",
  },
] satisfies GeneratedQuestionContent[];
