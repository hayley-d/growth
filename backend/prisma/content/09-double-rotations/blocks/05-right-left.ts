import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "animation",
  position: 5,
  transcript:
    "Right-left is the mirror. The tree starts with 10 at the root and 30 on its right. Watch 20 go in. 20 is bigger than 10 and smaller than 30, so it goes left of 30. The path goes right, then left, so this is the right-left case. 10 has balance factor minus 2 and its taller child 30 has plus 1. Straighten: rotate right at the child, 30. The path becomes straight: 10, 20, 30. That is the right-right case. Fix: rotate left at the unbalanced node, 10. 20 becomes the new root of the subtree, with 10 on its left and 30 on its right.",
  body: {
    startingKeys: [10, 30],
    steps: [{ operation: "insert", key: 20 }],
    autoplay: false,
    markdown:
      "## Right-left is the mirror\n\nPress **Step** and watch `20` go in. The path goes **right**, then **left**, so this is the **right-left** case.\n\n1. **Straighten.** Rotate right at the child, `30`. The path becomes straight: `10`, `20`, `30`. That is the right-right case.\n2. **Fix.** Rotate left at the unbalanced node, `10`.\n\nAgain the node where the path turned, `20`, becomes the new root of the subtree.",
  },
} satisfies BlockContent;
