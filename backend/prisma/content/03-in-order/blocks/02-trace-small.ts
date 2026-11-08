import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "code_trace",
  position: 2,
  transcript:
    "The code runs on a tree with 20 at the root, 10 on the left and 30 on the right. inorder(20) calls inorder(10) first, and waits at line 3. 10 has no children, so inorder(10) visits 10 and returns. Then inorder(20) visits 20 at line 4, and calls inorder(30) at line 5, which visits 30. The visited list is 10, 20, 30.",
  body: {
    algorithmCode: "inorder",
    startingKeys: [20, 10, 30],
    operation: { operation: "traverse" },
  },
} satisfies BlockContent;
