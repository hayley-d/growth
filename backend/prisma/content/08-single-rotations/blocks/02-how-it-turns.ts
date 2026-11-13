import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "code_trace",
  position: 2,
  transcript:
    "How a right rotation turns. A right rotation on the unbalanced node has four steps. One, the unbalanced node's left child moves up. Two, the unbalanced node becomes that child's right child. Three, the child's old right subtree, the inner subtree, becomes the unbalanced node's left subtree. Four, heights update. The in-order order of the keys does not change, so the tree is still a search tree. That is the same in-order fact as in the in-order lesson. Press Step to insert 5 and run the code one line at a time. When 40 reaches balance factor 2, the code calls rotateRight of 40. Watch node.left equals pivot.right move 30 across, then pivot.right equals node lift 20 up. The code calls the child that moves up the pivot. 5 goes left of 10. 40 reaches balance factor 2. It is left-left. 20 moves up. 30 moves across to become the left child of 40. 20 ends at the root, with 10 and 5 on the left and 40, 30 and 50 on the right.",
  body: {
    algorithmCode: "rotate-right",
    startingKeys: [40, 20, 50, 10, 30],
    operation: { operation: "insert", key: 5 },
    markdown:
      "## How a right rotation turns\n\nA right rotation on the unbalanced node has four steps:\n\n1. The unbalanced node's left child moves up.\n2. The unbalanced node becomes that child's right child.\n3. The child's old right subtree (the **inner subtree**) becomes the unbalanced node's left subtree.\n4. Heights update.\n\nThe in-order order of the keys does not change. So the tree is still a search tree. That is the same in-order fact as in the in-order lesson.\n\nPress **Step** to insert 5 and run the code one line at a time. When 40 reaches balance factor 2, the code calls `rotateRight(40)`. Watch `node.left = pivot.right` move 30 across, then `pivot.right = node` lift 20 up. The code calls the child that moves up the pivot.",
  },
} satisfies BlockContent;
