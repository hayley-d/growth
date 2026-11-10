import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "code_trace",
  position: 4,
  style: "visual",
  transcript:
    "The code runs on a tree with 40 at the root. 20 is on its left, with children 10 and 30. 60 is on its right, with 50 on its left. Step through and watch the visited list: 10, 20, 30, 40, 50, 60. Each key is bigger than the one before it.",
  body: {
    algorithmCode: "inorder",
    startingKeys: [40, 20, 60, 10, 30, 50],
    operation: { operation: "traverse" },
  },
} satisfies BlockContent;
