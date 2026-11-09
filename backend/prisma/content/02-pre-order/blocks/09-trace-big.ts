import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "code_trace",
  position: 9,
  transcript:
    "The code runs on the tree with 8 at the root. It visits 8, then the whole left subtree, 4, 2 and 6, before it goes right to 12, 10 and 14. While the left subtree runs, preorder(8) waits on the stack at line 4.",
  body: {
    algorithmCode: "preorder",
    startingKeys: [8, 4, 12, 2, 6, 10, 14],
    operation: { operation: "traverse" },
  },
} satisfies BlockContent;
