import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "diagram",
  position: 5,
  style: "visual",
  transcript:
    "The tree after the fix from the last trace. 30 is at the root. 15 is on its left, with 10 and 20 as its children. 40 is on its right. 15 is highlighted because it is now on top of the subtree that was unbalanced. The subtree is two levels tall, the same as before 15 was inserted, so 30 never needed a fix.",
  body: {
    startingKeys: [30, 15, 40, 10, 20],
    highlights: [{ key: 15, state: "rotating" }],
    caption:
      "After inserting 15 and fixing it with two rotations, 15 tops the subtree. It is as tall as before the insert, so 30 needs no fix.",
    labels: [{ text: ["Top of the fixed subtree"], keys: [15], place: "side" }],
  },
} satisfies BlockContent;
