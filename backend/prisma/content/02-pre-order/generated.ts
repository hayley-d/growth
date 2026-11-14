import type { GeneratedQuestionContent } from "@/infrastructure/course-content/content/content-schema";

export default [
  {
    key: "pre-order-easy",
    generatorKey: "traversal-order",
    generatorOptions: { order: "preorder", shape: "bst" },
    type: "order_nodes",
    difficulty: 1,
    bloomsLevel: "apply",
    reviewLesson: "pre-order",
  },
  {
    key: "pre-order-medium",
    generatorKey: "traversal-order",
    generatorOptions: { order: "preorder", shape: "bst" },
    type: "order_nodes",
    difficulty: 2,
    bloomsLevel: "apply",
    reviewLesson: "pre-order",
  },
  {
    key: "pre-order-hard",
    generatorKey: "traversal-order",
    generatorOptions: { order: "preorder", shape: "bst" },
    type: "order_nodes",
    difficulty: 3,
    bloomsLevel: "apply",
    reviewLesson: "pre-order",
  },
] satisfies GeneratedQuestionContent[];
