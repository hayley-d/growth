import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "animation",
  position: 3,
  transcript:
    "Where the inner subtree goes. This tree has 50 at the root. 30 is on its left with children 20 and 40, and 70 is on its right. Inserting 10 makes 50 unbalanced, with balance factor plus 2, and 30 leans left, plus 1, so this is left-left. 40 is the inner subtree. It sits between 30 and 50 in sorted order. When 30 moves up, 40 can't stay on 30's right, because 50 now goes there. So 40 moves across to become the left child of 50. It is still bigger than 30 and smaller than 50, so the tree stays a search tree. Press Play and watch 40 move. Watch 10 go in. The tree starts with 50 at the root, 30 on the left with children 20 and 40, and 70 on the right. 10 goes left of 20. 50 now has balance factor 2, so it is the unbalanced node. The case is left-left. 30 moves up. 40, the inner subtree, moves to become the left child of 50. The result is 30 at the root, with 20 and 10 on the left and 50, 40 and 70 on the right.",
  body: {
    startingKeys: [50, 30, 70, 20, 40],
    steps: [{ operation: "insert", key: 10 }],
    autoplay: false,
    markdown:
      "## Where the inner subtree goes\n\nThis tree has 50 at the root. 30 is on its left with children 20 and 40, and 70 is on its right.\n\nInserting 10 makes 50 unbalanced (balance factor **+2**), and 30 leans left (**+1**), so this is **left-left**.\n\n`40` is the **inner subtree**. It sits between 30 and 50 in sorted order. When 30 moves up, 40 can't stay on 30's right, because 50 now goes there. So 40 moves across to become the **left child of 50**. It is still bigger than 30 and smaller than 50, so the tree stays a search tree.\n\nPress **Play** and watch 40 move.",
  },
} satisfies BlockContent;
