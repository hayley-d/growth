import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "animation",
  position: 4,
  transcript:
    "Watch 10 go in. The tree starts with 50 at the root, 30 on the left with children 20 and 40, and 70 on the right. 10 goes left of 20. 50 now has balance factor 2, so it is the unbalanced node. The case is left-left. 30 moves up. 40, the inner subtree, moves to become the left child of 50. The result is 30 at the root, with 20 and 10 on the left and 50, 40 and 70 on the right.",
  body: {
    startingKeys: [50, 30, 70, 20, 40],
    steps: [{ operation: "insert", key: 10 }],
    autoplay: false,
  },
} satisfies BlockContent;
