import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "animation",
  position: 4,
  transcript:
    "Right-right. Right-right is the mirror of left-left. A node with balance factor minus 2 whose right child has balance factor minus 1, or 0, is the right-right case. There is too much weight on the right of the right. Press Play to insert 30 and watch the balance factors in the messages. 30 has height 1 and balance factor 0. 20 has height 2 and balance factor minus 1. 10 has height 3 and balance factor minus 2. Fix it with one left rotation on the unbalanced node, 10. Swap the words: left with right, plus with minus, right rotation with left rotation. 30 goes right of 20. 10 hits minus 2. The case is right-right. 20 moves up, and 10 becomes its left child.",
  body: {
    startingKeys: [10, 20],
    steps: [{ operation: "insert", key: 30 }],
    autoplay: false,
    markdown:
      "## Right-right\n\nRight-right is the **mirror** of left-left. A node with balance factor **−2** whose right child has balance factor **−1** (or 0) is the **right-right** case. There is too much weight on the right of the right.\n\nPress Play to insert 30 and watch the balance factors in the messages.\n\n- `30` is a leaf: height 1, BF 0\n- `20`: left height 0, right height 1 → height 2, BF **−1**\n- `10`: left height 0, right height 2 → height 3, BF **−2**\n\nFix it with **one left rotation** on the unbalanced node (`10`).\n\nSwap the words: left with right, + with −, right rotation with left rotation.",
  },
} satisfies BlockContent;
