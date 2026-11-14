import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "code_trace",
  position: 1,
  style: "visual",
  transcript:
    "The code runs on a tree with 8 at the root, 4 on the left and 12 on the right. The queue starts with 8. 8 is taken from the front and visited, then 4 and 12 are added to the back. 4 is taken and visited. It has no children. 12 is taken and visited. It has no children either. The queue is empty, so the traversal is done. The visited list is 8, 4, 12.",
  body: {
    algorithmCode: "levelorder",
    startingKeys: [8, 4, 12],
    operation: { operation: "traverse" },
  },
} satisfies BlockContent;
