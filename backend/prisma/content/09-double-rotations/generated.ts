import type { GeneratedQuestionContent } from "@/infrastructure/course-content/content/content-schema";

export default [
  {
    key: "predict-rotation-single",
    generatorKey: "predict-rotation",
    generatorOptions: { unbalanced: true },
    type: "predict_rotation",
    difficulty: 2,
    bloomsLevel: "apply",
    reviewLesson: "single-rotations",
  },
  {
    key: "predict-rotation-mixed",
    generatorKey: "predict-rotation",
    generatorOptions: { unbalanced: true },
    type: "predict_rotation",
    difficulty: 3,
    bloomsLevel: "apply",
    reviewLesson: "double-rotations",
  },
  {
    key: "predict-rotation-double",
    generatorKey: "predict-rotation",
    generatorOptions: { unbalanced: true },
    type: "predict_rotation",
    difficulty: 4,
    bloomsLevel: "apply",
    reviewLesson: "double-rotations",
  },
  {
    key: "predict-rotation-double-hard",
    generatorKey: "predict-rotation",
    generatorOptions: { unbalanced: true },
    type: "predict_rotation",
    difficulty: 5,
    bloomsLevel: "analyse",
    reviewLesson: "double-rotations",
  },
] satisfies GeneratedQuestionContent[];
