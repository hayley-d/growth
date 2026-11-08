import type { LessonContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  key: "avl-final-challenge",
  unit: "avl-trees",
  position: 6,
  title: "AVL final challenge",
  summary: "A final quiz that puts insertion, deletion and rotations together.",
  kind: "checkpoint",
  objectives: ["Insert, delete and rotate in one AVL tree"],
} satisfies LessonContent;
