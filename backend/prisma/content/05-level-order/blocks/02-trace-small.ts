import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "code_trace",
  position: 2,
  transcript:
    "Trace a small tree. Press Step to run the code on the tree one line at a time. Each step says what goes into the queue and what comes out. The code runs on a tree with 20 at the root, 10 on the left and 30 on the right. The queue starts with 20. 20 is taken from the front and visited, then 10 and 30 are added to the back. 10 is taken and visited. It has no children. 30 is taken and visited. It has no children either. The queue is empty, so every node has been visited. The visited list is 20, 10, 30.",
  body: {
    algorithmCode: "levelorder",
    startingKeys: [20, 10, 30],
    operation: { operation: "traverse" },
    markdown:
      "## Trace a small tree\n\nPress **Step** to run the code on the tree one line at a time.\n\nEach step says what goes into the queue and what comes out. Notice that 10 and 30 wait in the queue until it's their turn.",
  },
} satisfies BlockContent;
