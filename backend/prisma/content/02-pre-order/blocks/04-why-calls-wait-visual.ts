import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "code_trace",
  position: 4,
  style: "visual",
  transcript:
    "The code runs on a tree with 30 at the root, 20 on its left and 40 on its right. 20 has 10 on its left. preorder(30) visits 30, then calls preorder(20) at line 4 and waits. preorder(20) visits 20 and calls preorder(10), so now two calls are waiting on the stack. preorder(10) visits 10 and returns. preorder(20) carries on at line 5, finds no right child, and returns. Only then does preorder(30) carry on at line 5 and call preorder(40). The visited list is 30, 20, 10, 40.",
  body: {
    algorithmCode: "preorder",
    startingKeys: [30, 20, 40, 10],
    operation: { operation: "traverse" },
  },
} satisfies BlockContent;
