import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "animation",
  position: 6,
  transcript:
    "Where the subtrees go. 50 is at the root. 20 is on its left, with children 10 and 30. 70 is on its right. Watch 40 go in. 40 is smaller than 50, bigger than 20 and bigger than 30, so it goes right of 30. 50 has balance factor plus 2 and its taller child 20 has minus 1. The path goes left at 50, then right at 20, so this is left-right. Straighten: rotate left at 20. Fix: rotate right at 50. 30, the node where the path turned, becomes the new root of the subtree. 30 had 40 on its right. 40 goes to the right side, under 50. If 30 had a left subtree, it would go to the left side, under 20. The result is 30 at the root, with 20 and 10 on the left, and 50 with children 40 and 70 on the right.",
  body: {
    startingKeys: [50, 20, 70, 10, 30],
    steps: [{ operation: "insert", key: 40 }],
    autoplay: false,
    markdown:
      "## Where the subtrees go\n\nPress **Step** and watch `40` go in. The path goes left at `50`, then right at `20`, so this is left-right. Straighten at `20`, then fix at `50`.\n\n`30`, the node where the path turned, becomes the new root of the subtree. It has to hand over its own subtrees:\n\n- Its **right** subtree goes to the right side, under `50`. Here that is `40`.\n- Its **left** subtree goes to the left side, under `20`. Here it is empty.",
  },
} satisfies BlockContent;
