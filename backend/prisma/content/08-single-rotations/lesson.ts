import type { LessonContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  key: "single-rotations",
  unit: "avl-trees",
  position: 2,
  title: "Single rotations",
  summary:
    "Fix a left-left imbalance with a right rotation, and a right-right imbalance with a left rotation.",
  kind: "lesson",
  notePrompt:
    "Explain a single rotation in your own words. When do you use a right rotation, which node moves up, and why do the keys stay in order?",
  objectives: [
    "Recognise a left-left and a right-right imbalance from the balance factors",
    "Do a right rotation and a left rotation, saying which node moves up and where the inner subtree goes",
    "Explain why a rotation keeps the keys in sorted (in-order) order",
  ],
} satisfies LessonContent;
