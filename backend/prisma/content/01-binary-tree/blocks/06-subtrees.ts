import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "diagram",
  position: 6,
  transcript:
    "Subtrees. A node and everything below it is a subtree. The left subtree of 8 is 4, 2 and 6. The right subtree of 8 is 12, 10 and 14. In a search tree, everything in the left subtree of a node is smaller than the node, and everything in the right subtree is bigger. So 2, 4 and 6 are all smaller than 8, and 10, 12 and 14 are all bigger. In the tree, 8 is the root. Choose left subtree or right subtree in the text to light up its nodes.",
  body: {
    startingKeys: [8, 4, 12, 2, 6, 10, 14],
    highlights: [],
    caption:
      "Everything in the left subtree of 8 is smaller than 8. Everything in the right subtree is bigger.",
    labels: [
      { text: ["8"], keys: [8], place: "right" },
      { text: ["Left subtree of 8:", "all smaller than 8"], keys: [2, 4, 6], place: "below" },
      { text: ["Right subtree of 8:", "all bigger than 8"], keys: [10, 12, 14], place: "below" },
    ],
    markdown:
      "## Subtrees\n\nA node and everything below it is a **subtree**. The **left subtree** of 8 is 4, 2 and 6. The **right subtree** of 8 is 12, 10 and 14.\n\nIn a search tree, everything in the left subtree of a node is smaller than the node, and everything in the right subtree is bigger. So 2, 4 and 6 are all smaller than 8, and 10, 12 and 14 are all bigger.",
    terms: {
      "left subtree": [4, 2, 6],
      "right subtree": [12, 10, 14],
      subtree: [4, 2, 6, 12, 10, 14],
    },
  },
} satisfies BlockContent;
