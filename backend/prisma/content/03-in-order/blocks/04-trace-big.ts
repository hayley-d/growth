import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "code_trace",
  position: 4,
  transcript:
    "The code runs on the tree with 8 at the root. It goes left until it reaches 2, which it visits first. Then it visits 4, 6, 8, 10, 12 and 14. While the left subtree runs, inorder(8) waits on the stack at line 3.",
  body: {
    algorithmCode: "inorder",
    startingKeys: [8, 4, 12, 2, 6, 10, 14],
    operation: { operation: "traverse" },
  },
} satisfies BlockContent;
