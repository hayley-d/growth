import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "code_trace",
  position: 1,
  style: "visual",
  transcript:
    "The code runs on a tree with 8 at the root, 4 on the left and 12 on the right. postorder(8) calls postorder(4) at line 3 and waits on the stack. 4 has no children, so postorder(4) visits 4 and returns. postorder(8) carries on at line 4 and calls postorder(12), which visits 12. Last, postorder(8) visits 8 at line 5. The visited list is 4, 12, 8.",
  body: {
    algorithmCode: "postorder",
    startingKeys: [8, 4, 12],
    operation: { operation: "traverse" },
  },
} satisfies BlockContent;
