import type { LessonContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  key: "double-rotations",
  unit: "avl-trees",
  position: 3,
  title: "Double rotations",
  summary: "Fix a left-right or right-left imbalance with two rotations.",
  kind: "lesson",
  notePrompt:
    "Explain a double rotation in your own words. How do you tell it apart from a single rotation, which rotation happens first, and which node ends up on top?",
  objectives: [
    "Recognise a left-right and a right-left imbalance from the balance factors of a node and its taller child",
    "Do a left-right and a right-left double rotation, saying which rotation happens first and which node becomes the new root of the subtree",
    "Explain why a single rotation can't fix a left-right or right-left imbalance",
  ],
} satisfies LessonContent;
