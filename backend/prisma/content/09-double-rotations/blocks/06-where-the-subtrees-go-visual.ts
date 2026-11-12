import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "diagram",
  position: 6,
  style: "visual",
  transcript:
    "After the double rotation, 30 is at the root. 20 is on its left with 10 under it. 50 is on its right with children 40 and 70. 30 and 40 are highlighted. The labels say 30 is the node where the path turned and is now the new root of the subtree, and 40 was the right subtree of 30 and moved under 50.",
  body: {
    startingKeys: [30, 20, 50, 10, 40, 70],
    highlights: [
      { key: 30, state: "rotating" },
      { key: 40, state: "new" },
    ],
    caption: "30 is the new root of the subtree. Its right subtree, 40, went under 50.",
    labels: [
      { text: ["The path turned here.", "Now on top"], keys: [30], place: "side" },
      { text: ["Was right of 30,", "now left of 50"], keys: [40], place: "below" },
    ],
  },
} satisfies BlockContent;
