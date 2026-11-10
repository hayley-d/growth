import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "code_trace",
  position: 2,
  transcript:
    "Trace a small tree. Press Step to run the code on the tree one line at a time. Watch the call stack. postorder(20) can't visit 20 until postorder(10) and postorder(30) are both done, so it waits on the stack. The code runs on a tree with 20 at the root, 10 on the left and 30 on the right. postorder(20) calls postorder(10), which visits 10. Then postorder(20) calls postorder(30) at line 4 and waits there while 30 is visited. Last, postorder(20) visits 20 at line 5. The visited list is 10, 30, 20.",
  body: {
    algorithmCode: "postorder",
    startingKeys: [20, 10, 30],
    operation: { operation: "traverse" },
    markdown:
      "## Trace a small tree\n\nPress **Step** to run the code on the tree one line at a time.\n\nWatch the call stack. `postorder(20)` can't visit 20 until `postorder(10)` and `postorder(30)` are both done, so it waits on the stack.",
  },
} satisfies BlockContent;
