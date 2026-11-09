import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "code_trace",
  position: 2,
  style: "visual",
  transcript:
    "The code runs on a tree with 8 at the root, 4 on the left and 12 on the right. preorder(8) visits 8 at line 3, then calls preorder(4) at line 4 and waits on the stack. preorder(4) visits 4. 4 has no children, so its calls return straight away. preorder(8) carries on at line 5 and calls preorder(12), which visits 12. The visited list is 8, 4, 12.",
  body: {
    algorithmCode: "preorder",
    startingKeys: [8, 4, 12],
    operation: { operation: "traverse" },
  },
} satisfies BlockContent;
