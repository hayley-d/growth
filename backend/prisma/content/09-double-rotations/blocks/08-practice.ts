import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "playground",
  position: 8,
  transcript:
    "Practice. 30 is at the root, with 20 on its left and 60 on its right. 60 has children 50 and 70. Insert 40, then 10, then 15. Before each one, say the case and the rotations that fix it, then press Step to check. 40 makes 30 right-left: rotate right at 60, then left at 30, and 50 becomes the new root. 10 needs no rotation. 15 makes 20 left-right: rotate left at 10, then right at 20, and 15 takes the place of 20.",
  body: {
    startingKeys: [30, 20, 60, 50, 70],
    allowedOperations: ["insert"],
    instructions:
      "Insert 40, then 10, then 15. Before each one, say the case and the rotations that fix it. Then press Step to check.",
    goal: { kind: "containsKeys", keys: [10, 15, 20, 30, 40, 50, 60, 70] },
  },
} satisfies BlockContent;
