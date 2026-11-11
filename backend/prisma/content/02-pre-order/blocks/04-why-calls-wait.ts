import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "code_trace",
  position: 4,
  transcript:
    "Why calls wait. The tree has 20 at the root, 10 on its left and 30 on its right. 10 has 5 on its left. Press Step and watch the call stack. After you visit 20, preorder(20) calls preorder(10). Since preorder(20) is not done yet, it stays on the stack and waits while preorder(10) runs. preorder(10) does the same while preorder(5) runs, so three calls are on the stack at once. Once preorder(10) returns, preorder(20) can carry on and walk its right subtree.",
  body: {
    algorithmCode: "preorder",
    startingKeys: [20, 10, 30, 5],
    operation: { operation: "traverse" },
    showCode: false,
    markdown:
      "## Why calls wait\n\nPress **Step** and watch the call stack.\n\nAfter you visit 20, `preorder(20)` calls `preorder(10)`. Since `preorder(20)` is not done yet, it stays on the stack and waits while `preorder(10)` runs. Once `preorder(10)` returns, `preorder(20)` can carry on and walk its right subtree.",
  },
} satisfies BlockContent;
