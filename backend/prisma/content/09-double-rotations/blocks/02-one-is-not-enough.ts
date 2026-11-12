import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "diagram",
  position: 2,
  transcript:
    "One rotation is not enough. Try the fix from lesson 8: rotate right at 30. 10 moves up and 30 becomes its right child. 20 is the inner subtree, so it moves across to become the left child of 30. The tree is now 10 at the top, 30 on its right, and 20 on the left of 30. 10 is unbalanced, with balance factor minus 2. 20 moved across, but it did not move up. 20 is what made the tree too tall, so the tree is still too tall. It just leans the other way.",
  body: {
    startingKeys: [10, 30, 20],
    treeMode: "bst",
    highlights: [
      { key: 10, state: "unbalanced" },
      { key: 20, state: "rotating" },
    ],
    caption: "After one right rotation at 30, the tree leans the other way.",
    labels: [
      { text: ["Balance factor −2"], keys: [10], place: "side" },
      { text: ["Moved across,", "not up"], keys: [20], place: "below" },
    ],
    markdown:
      "## One rotation is not enough\n\nTry the fix from lesson 8: rotate right at `30`. `10` moves up and `30` becomes its right child.\n\n`20` is the **inner subtree**, so it moves across to the left of `30`. It moves across, but not up.\n\n`20` is what made the tree too tall. So the tree is still too tall. It just leans the other way: `10` now has balance factor **−2**.",
    terms: { "inner subtree": [20] },
  },
} satisfies BlockContent;
