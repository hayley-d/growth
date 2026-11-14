import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "code_trace",
  position: 4,
  transcript:
    "Trace an insert with two rotations. Same tree as before, but this time we insert 15. The code goes down through 30, 20 and 10, and 15 becomes the right child of 10. Walking back up, 20 has a balance factor of 2, so it is the first unbalanced node. But its left child 10 leans right, not left. One rotation is not enough. First rotate 10 left, so 15 moves up. Then rotate 20 right. 15 is now on top of 10 and 20.",
  body: {
    algorithmCode: "insert",
    startingKeys: [30, 20, 40, 10],
    operation: { operation: "insert", key: 15 },
    markdown:
      "## Trace an insert with two rotations\n\nThis time we insert `15`. The first unbalanced node is the same one, but the child on the heavy side leans the other way.\n\nWatch the code do **two** rotations, one after the other.",
  },
} satisfies BlockContent;
