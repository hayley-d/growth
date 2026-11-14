import type { GeneratedQuestionContent } from "@/infrastructure/course-content/content/content-schema";

export default [
  {
    key: "predict-rotation-none",
    generatorKey: "predict-rotation",
    generatorOptions: { unbalanced: true },
    type: "predict_rotation",
    difficulty: 1,
    bloomsLevel: "understand",
    reviewLesson: "single-rotations",
  },
  {
    key: "predict-rotation-single",
    generatorKey: "predict-rotation",
    generatorOptions: { unbalanced: true },
    type: "predict_rotation",
    difficulty: 2,
    bloomsLevel: "apply",
    reviewLesson: "single-rotations",
  },
] satisfies GeneratedQuestionContent[];
