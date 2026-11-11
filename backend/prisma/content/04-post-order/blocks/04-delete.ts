import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "delete_tree",
  position: 4,
  transcript:
    "Deleting trees. Post-order traversal is used to delete trees. When you delete a tree you have to first delete the children before you delete the parent. This is because if you delete the parent first then there is no way to reach the children. Press Step to delete the tree with 8 at the root, one node at a time. The leaves 2 and 6 go first, then their parent 4. Then 10, 14 and their parent 12. 8, the root, goes last.",
  body: {
    startingKeys: [8, 4, 12, 2, 6, 10, 14],
    caption: "Each node is deleted after its children.",
    markdown:
      "## Deleting trees\n\nPost-order traversal is used to delete trees. When you delete a tree you have to first delete the children before you delete the parent. This is because if you delete the parent first then there is no way to reach the children.",
  },
} satisfies BlockContent;
