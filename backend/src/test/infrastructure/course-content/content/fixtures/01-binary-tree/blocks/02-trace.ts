import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "code_trace",
  position: 2,
  transcript: "The code visits 20, then 10, then 30.",
  body: {
    algorithmCode: "preorder",
    startingKeys: [20, 10, 30],
    operation: { operation: "traverse" },
  },
} satisfies BlockContent;
