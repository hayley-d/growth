import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "code_trace",
  position: 2,
  transcript:
    "Trace a small tree. Press Step to run the code on the tree one line at a time. Watch the call stack. inorder(20) can't visit 20 until inorder(10) is done, so it waits on the stack. The code runs on a tree with 20 at the root, 10 on the left and 30 on the right. inorder(20) calls inorder(10) first, and waits at line 3. 10 has no children, so inorder(10) visits 10 and returns. Then inorder(20) visits 20 at line 4, and calls inorder(30) at line 5, which visits 30. The visited list is 10, 20, 30.",
  body: {
    algorithmCode: "inorder",
    startingKeys: [20, 10, 30],
    operation: { operation: "traverse" },
    markdown:
      "## Trace a small tree\n\nPress **Step** to run the code on the tree one line at a time.\n\nWatch the call stack. `inorder(20)` can't visit 20 until `inorder(10)` is done, so it waits on the stack.",
  },
} satisfies BlockContent;
