import type { GeneratedQuestionContent } from "@/infrastructure/course-content/content/content-schema";

export default [
  {
    key: "height-easy",
    generatorKey: "height",
    type: "text",
    difficulty: 1,
    bloomsLevel: "apply",
    reviewLesson: "binary-tree",
  },
  {
    key: "height-medium",
    generatorKey: "height",
    type: "text",
    difficulty: 2,
    bloomsLevel: "apply",
    reviewLesson: "binary-tree",
  },
  {
    key: "height-hard",
    generatorKey: "height",
    type: "text",
    difficulty: 3,
    bloomsLevel: "apply",
    reviewLesson: "binary-tree",
  },
] satisfies GeneratedQuestionContent[];
