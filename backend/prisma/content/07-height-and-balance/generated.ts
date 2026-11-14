import type { GeneratedQuestionContent } from "@/infrastructure/course-content/content/content-schema";

export default [
  {
    key: "height-easy",
    generatorKey: "height",
    type: "text",
    difficulty: 1,
    bloomsLevel: "apply",
    reviewLesson: "height-and-balance",
  },
  {
    key: "height-hard",
    generatorKey: "height",
    type: "text",
    difficulty: 3,
    bloomsLevel: "apply",
    reviewLesson: "height-and-balance",
  },
  {
    key: "balance-factor-easy",
    generatorKey: "balance-factor",
    type: "text",
    difficulty: 1,
    bloomsLevel: "apply",
    reviewLesson: "height-and-balance",
  },
  {
    key: "balance-factor-hard",
    generatorKey: "balance-factor",
    type: "text",
    difficulty: 3,
    bloomsLevel: "apply",
    reviewLesson: "height-and-balance",
  },
  {
    key: "is-avl-easy",
    generatorKey: "is-avl",
    type: "multiple_choice",
    difficulty: 1,
    bloomsLevel: "understand",
    reviewLesson: "height-and-balance",
  },
  {
    key: "is-avl-hard",
    generatorKey: "is-avl",
    type: "multiple_choice",
    difficulty: 3,
    bloomsLevel: "analyse",
    reviewLesson: "height-and-balance",
  },
] satisfies GeneratedQuestionContent[];
