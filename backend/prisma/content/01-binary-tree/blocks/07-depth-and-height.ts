import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "diagram",
  position: 7,
  transcript:
    "Depth and height. The depth of a node is how many edges lie between it and the root. The root has depth 0, 4 and 12 have depth 1, and the leaves have depth 2. The height of a node counts the nodes on the longest way down to a leaf, starting with the node itself. A leaf has height 1, and 4 and 12 have height 2. The height of the tree is the height of its root, which is 3. So the height is the deepest depth plus 1. Some books count height in edges instead, which makes a leaf height 0. In this course a leaf has height 1. In the tree, one path from the root to a leaf is highlighted: 8, then 12, then 14. It has three nodes, so the height of the tree is 3. 14 is two edges below the root, so its depth is 2.",
  body: {
    startingKeys: [8, 4, 12, 2, 6, 10, 14],
    highlights: [
      { key: 8, state: "active" },
      { key: 12, state: "active" },
      { key: 14, state: "active" },
    ],
    caption: "Every path from the root to a leaf has 3 nodes, so the height is 3.",
    labels: [
      {
        text: ["Height 3:", "3 nodes from", "the root to a leaf"],
        keys: [8, 12, 14],
        place: "side",
      },
      { text: ["14 has depth 2"], keys: [14], place: "below" },
    ],
    markdown:
      "## Depth and height\n\nThe **depth** of a node is how many edges lie between it and the root. The root has depth 0, 4 and 12 have depth 1, and the leaves have depth 2.\n\nThe **height** of a node counts the nodes on the longest way down to a leaf, starting with the node itself. A leaf has height 1, and 4 and 12 have height 2.\n\nThe height of the tree is the height of its root: 3. That's the deepest depth plus 1.\n\nSome books count height in edges instead, which makes a leaf height 0. In this course a leaf has height 1.",
    terms: { depth: [4, 12], height: [8, 12, 14] },
  },
} satisfies BlockContent;
