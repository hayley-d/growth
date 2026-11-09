import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "code_trace",
  position: 3,
  transcript:
    "Trace a small tree. Press Step to run the code on the tree one line at a time. Watch the call stack. A stack is a data structure where the last node on the stack is the first node off the stack. You'll see each call to preorder gets pushed to the call stack and is popped off the stack when it finishes. The code runs on a tree with 20 at the root, 10 on the left and 30 on the right. preorder(20) visits 20, then calls preorder(10), which visits 10. 10 has no children, so its calls return straight away. preorder(20) carries on at line 5 and calls preorder(30), which visits 30. The visited list is 20, 10, 30.",
  body: {
    algorithmCode: "preorder",
    startingKeys: [20, 10, 30],
    operation: { operation: "traverse" },
    markdown:
      "## Trace a small tree\n\nPress **Step** to run the code on the tree one line at a time.\n\nWatch the call stack. A stack is a data structure where the last node on the stack is the first node off the stack. You’ll see each call to `preorder` gets pushed to the call stack and is popped off the stack when it finishes.",
  },
} satisfies BlockContent;
