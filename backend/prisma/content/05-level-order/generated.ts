import type { GeneratedQuestionContent } from "@/infrastructure/course-content/content/content-schema";

export default [
  {
    key: "level-order-easy",
    generatorKey: "traversal-order",
    generatorOptions: { order: "levelorder", shape: "bst" },
    type: "order_nodes",
    difficulty: 1,
    bloomsLevel: "apply",
    reviewLesson: "level-order",
  },
  {
    key: "level-order-medium",
    generatorKey: "traversal-order",
    generatorOptions: { order: "levelorder", shape: "bst" },
    type: "order_nodes",
    difficulty: 2,
    bloomsLevel: "apply",
    reviewLesson: "level-order",
  },
  {
    key: "level-order-hard",
    generatorKey: "traversal-order",
    generatorOptions: { order: "levelorder", shape: "bst" },
    type: "order_nodes",
    difficulty: 3,
    bloomsLevel: "apply",
    reviewLesson: "level-order",
  },
] satisfies GeneratedQuestionContent[];
