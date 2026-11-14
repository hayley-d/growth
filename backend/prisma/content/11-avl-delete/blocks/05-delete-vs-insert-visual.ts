import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "diagram",
  position: 5,
  style: "visual",
  transcript:
    "The tree after the fixes from the last trace. 70 is the new root. 50 is on its left, with 40 and 60 as its children. 90 is on its right. 40 topped the subtree from the first fix, and 70 topped the tree after the second fix. The whole tree is one level shorter than before the delete.",
  body: {
    startingKeys: [70, 50, 90, 40, 60, 80, 100, 30, 45, 55, 110],
    highlights: [
      { key: 40, state: "rotating" },
      { key: 70, state: "rotating" },
    ],
    caption:
      "After deleting 20 there were two fixes. 40 tops the first one and 70 tops the second. The tree is one level shorter than before.",
    labels: [
      { text: ["Top of the first fix"], keys: [40], place: "side" },
      { text: ["Top of the second fix"], keys: [70], place: "side" },
    ],
  },
} satisfies BlockContent;
