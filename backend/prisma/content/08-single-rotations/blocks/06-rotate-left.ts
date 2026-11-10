import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "animation",
  position: 6,
  transcript:
    "Watch 80 go in. The tree starts with 30 at the root, 20 on the left, and 50 on the right with children 40 and 70. 80 goes right of 70. 30 now has balance factor minus 2. The case is right-right. 50 moves up. 40, the inner subtree, moves to become the right child of 30. The result is 50 at the root, with 30, 20 and 40 on the left and 70 and 80 on the right.",
  body: {
    startingKeys: [30, 20, 50, 40, 70],
    steps: [{ operation: "insert", key: 80 }],
    autoplay: false,
  },
} satisfies BlockContent;
