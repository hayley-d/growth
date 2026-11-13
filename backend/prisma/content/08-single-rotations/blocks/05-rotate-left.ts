import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "animation",
  position: 5,
  transcript:
    "A left rotation with an inner subtree. This is the mirror of step 3. The tree has 30 at the root, 20 on its left, and 50 on its right with children 40 and 70. Inserting 80 makes 30 unbalanced, with balance factor minus 2, and 50 leans right, minus 1, so this is right-right. Fix it with one left rotation at 30. 40 is the inner subtree. When 50 moves up, 30 becomes its left child, so 40 can't stay on 50's left. It moves across to become the right child of 30. It is still bigger than 30 and smaller than 50, so the tree stays a search tree. Press Play and watch 50 move up and 40 move across. Watch 80 go in. The tree starts with 30 at the root, 20 on the left, and 50 on the right with children 40 and 70. 80 goes right of 70. 30 now has balance factor minus 2. The case is right-right. 50 moves up. 40, the inner subtree, moves to become the right child of 30. The result is 50 at the root, with 30, 20 and 40 on the left and 70 and 80 on the right.",
  body: {
    startingKeys: [30, 20, 50, 40, 70],
    steps: [{ operation: "insert", key: 80 }],
    autoplay: false,
    markdown:
      "## A left rotation with an inner subtree\n\nThis is the mirror of step 3. The tree has 30 at the root, 20 on its left, and 50 on its right with children 40 and 70.\n\nInserting 80 makes 30 unbalanced (balance factor **−2**), and 50 leans right (**−1**), so this is **right-right**. Fix it with one **left rotation** at 30.\n\n`40` is the **inner subtree**. When 50 moves up, 30 becomes its left child, so 40 can't stay on 50's left. It moves across to become the **right child of 30**. It is still bigger than 30 and smaller than 50, so the tree stays a search tree.\n\nPress **Play** and watch 50 move up and 40 move across.",
  },
} satisfies BlockContent;
