import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "code_trace",
  position: 3,
  transcript:
    "Trace an insert with a rotation. The tree has 30 at the root, 20 and 40 as its children, and 10 under 20. We insert 5. The code goes down through 30, 20 and 10, and 5 becomes the left child of 10. Walking back up, 10 is fine. Then 20 has a left side of height 2 and an empty right side, so its balance factor is 2. That is the first unbalanced node, and it is not the root. Its left child 10 leans left too, so one right rotation at 20 fixes it. 30 is not touched.",
  body: {
    algorithmCode: "insert",
    startingKeys: [30, 20, 40, 10],
    operation: { operation: "insert", key: 5 },
    markdown:
      "## Trace an insert with a rotation\n\nWe insert `5`. Walk back up with the code and watch the balance factors.\n\nThe first unbalanced node is **not the root**. It is the first one you meet on the way up. Step through the rotation and see which nodes move.",
  },
} satisfies BlockContent;
