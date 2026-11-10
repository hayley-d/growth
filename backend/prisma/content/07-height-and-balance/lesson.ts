import type { LessonContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  key: "height-and-balance",
  unit: "avl-trees",
  position: 1,
  title: "Height and balance factor",
  summary: "See why a stick tree is slow and work out each node's height and balance factor.",
  kind: "lesson",
  notePrompt:
    "Explain in your own words. What is height and the balance factor? Why is stick tree bad for search?",
  objectives: [
    "Explain why a binary search tree built from sorted keys makes search time O(n)",
    "Work out the height of a node or tree (a leaf has height 1, empty has height 0)",
    "Work out the balance factor of a node as left height minus right height",
    "Say whether a tree is a valid AVL tree by checking that every balance factor is -1, 0 or 1",
  ],
} satisfies LessonContent;
