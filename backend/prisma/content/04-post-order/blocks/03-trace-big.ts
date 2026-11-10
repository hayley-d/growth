import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "code_trace",
  position: 3,
  transcript:
    "Trace the bigger tree. The leaves come first, and 8, the root, comes last. 4 waits until both 2 and 6 are done. The code runs on the tree with 8 at the root. It visits 2, 6, then 4, then 10, 14, then 12, and 8 last. Each node waits on the stack until both of its subtrees are done.",
  body: {
    algorithmCode: "postorder",
    startingKeys: [8, 4, 12, 2, 6, 10, 14],
    operation: { operation: "traverse" },
    markdown:
      "## Trace the bigger tree\n\nThe leaves come first, and 8, the root, comes last. 4 waits until both 2 and 6 are done.",
  },
} satisfies BlockContent;
