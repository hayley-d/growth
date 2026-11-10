import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "animation",
  position: 2,
  transcript:
    "Watch 10 go in. The tree starts with 30 at the root and 20 on its left. 10 is smaller than 30 and smaller than 20, so it goes left of 20. 30 now has balance factor 2. The case is left-left. 20 moves up, and 30 becomes its right child. The result is 20 at the root, with 10 on the left and 30 on the right.",
  body: {
    startingKeys: [30, 20],
    steps: [{ operation: "insert", key: 10 }],
    autoplay: false,
  },
} satisfies BlockContent;
