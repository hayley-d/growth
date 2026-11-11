import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "code_trace",
  position: 3,
  transcript:
    "Trace the bigger tree. Watch the queue grow and shrink. The queue starts with 8. After 8 it holds 4 and 12. After 4 it holds 12, 2 and 6. After 12 it holds 2, 6, 10 and 14. The leaves have no children, so the queue now only shrinks. The visited list is 8, 4, 12, 2, 6, 10, 14, one row at a time.",
  body: {
    algorithmCode: "levelorder",
    startingKeys: [8, 4, 12, 2, 6, 10, 14],
    operation: { operation: "traverse" },
    markdown:
      "## Trace the bigger tree\n\nWatch the queue as you step. A whole row waits in it while the row before is being visited. The leaves add nothing, so at the end the queue only shrinks.",
  },
} satisfies BlockContent;
