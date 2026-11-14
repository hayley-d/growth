import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "code_trace",
  position: 2,
  transcript:
    "Trace a delete with two children. Press Step to run the delete code one line at a time. The tree has 40 at the root, 20 and 60 as its children, 10 and 30 under 20, and 50 and 70 under 60. We delete 40. The code finds 40, sees two children, and looks for the smallest key in the right subtree. That is 50. It copies 50 into the root and removes the old 50 from the right subtree. Then it walks back up. Every balance factor is between minus 1 and 1, so nothing needs fixing.",
  body: {
    algorithmCode: "delete",
    startingKeys: [40, 20, 60, 10, 30, 50, 70],
    operation: { operation: "delete", key: 40 },
    markdown:
      "## Trace a delete with two children\n\nPress **Step** to run the delete code one line at a time.\n\nWe delete `40`. It has two children, so the code looks in its right subtree for the replacement. Watch which key it picks and where that key goes. Then watch the walk back up. Every balance factor stays between -1 and 1, so nothing needs fixing.",
  },
} satisfies BlockContent;
