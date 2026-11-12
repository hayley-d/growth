import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "code_trace",
  position: 2,
  transcript:
    "Trace an insert with no rotation. Press Step to run the insert code one line at a time. The tree has 20 at the root, 10 on the left and 30 on the right, and we insert 5. The code goes down through 20 and 10, and 5 becomes the left child of 10. Then it walks back up. 10 now has height 2 and balance factor 1. 20 now has height 3 and balance factor 1. Both are between minus 1 and 1, so nothing needs fixing.",
  body: {
    algorithmCode: "insert",
    startingKeys: [20, 10, 30],
    operation: { operation: "insert", key: 5 },
    markdown:
      "## Trace an insert with no rotation\n\nPress **Step** to run the insert code one line at a time.\n\nWe insert `5`. Watch the code go down first. Then watch each node's height and balance factor on the way back up. Every balance factor stays between -1 and 1, so nothing needs fixing.",
  },
} satisfies BlockContent;
