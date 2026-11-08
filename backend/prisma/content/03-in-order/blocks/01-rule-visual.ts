import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "code_trace",
  position: 1,
  style: "visual",
  transcript:
    "The code runs on a tree with 8 at the root, 4 on the left and 12 on the right. inorder(8) calls inorder(4) at line 3 and waits on the stack. 4 has no children, so inorder(4) visits 4 and returns. inorder(8) carries on at line 4 and visits 8, then calls inorder(12) at line 5, which visits 12. The visited list is 4, 8, 12.",
  body: {
    algorithmCode: "inorder",
    startingKeys: [8, 4, 12],
    operation: { operation: "traverse" },
  },
} satisfies BlockContent;
