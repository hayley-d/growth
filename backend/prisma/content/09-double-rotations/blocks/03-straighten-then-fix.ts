import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "animation",
  position: 3,
  transcript:
    "Two rotations: straighten, then fix. The tree starts with 30 at the root and 10 on its left. Watch 20 go in. 20 is smaller than 30 and bigger than 10, so it goes right of 10. The path turns, so this is left-right. First, rotate left at the child, 10. 20 moves up and 10 becomes its left child. The path is now straight: 30, 20, 10. That is the left-left case from lesson 8. Second, rotate right at the unbalanced node, 30. 20 moves up again. 20 is the node where the path turned, and it becomes the new root of the subtree, with 10 on its left and 30 on its right.",
  body: {
    startingKeys: [30, 10],
    steps: [{ operation: "insert", key: 20 }],
    autoplay: false,
    markdown:
      "## Two rotations: straighten, then fix\n\nPress **Step** and watch `20` go in. The path turns at `10`, so this is left-right.\n\n1. **Straighten.** Rotate left at the child, `10`. The path becomes straight: `30`, `20`, `10`. That is the left-left case from lesson 8.\n2. **Fix.** Rotate right at the unbalanced node, `30`, as in lesson 8.\n\n`20`, the node where the path turned, moves up twice. It becomes the new root of the subtree.",
  },
} satisfies BlockContent;
