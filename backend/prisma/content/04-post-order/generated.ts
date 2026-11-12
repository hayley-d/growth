import type { GeneratedQuestionContent } from "@/infrastructure/course-content/content/content-schema";

export default [
  {
    key: "post-order-easy",
    generatorKey: "traversal-order",
    generatorOptions: { order: "postorder", shape: "bst" },
    type: "order_nodes",
    difficulty: 1,
    bloomsLevel: "apply",
    reviewLesson: "post-order",
  },
  {
    key: "post-order-medium",
    generatorKey: "traversal-order",
    generatorOptions: { order: "postorder", shape: "bst" },
    type: "order_nodes",
    difficulty: 2,
    bloomsLevel: "apply",
    reviewLesson: "post-order",
  },
  {
    key: "post-order-hard",
    generatorKey: "traversal-order",
    generatorOptions: { order: "postorder", shape: "bst" },
    type: "order_nodes",
    difficulty: 3,
    bloomsLevel: "apply",
    reviewLesson: "post-order",
  },
] satisfies GeneratedQuestionContent[];
