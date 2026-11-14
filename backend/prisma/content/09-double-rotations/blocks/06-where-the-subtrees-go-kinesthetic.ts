import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "playground",
  position: 6,
  style: "kinesthetic",
  transcript:
    "Predict, then check. The tree has 50 at the root, 20 on its left with children 10 and 30, and 70 on its right. Before you insert 25, point at the screen where you think 25 will end up after the rotations. Then insert 25 and press Step to check. 25 ends up under 20, on its right, because it was the left subtree of 30.",
  body: {
    startingKeys: [50, 20, 70, 10, 30],
    allowedOperations: ["insert"],
    instructions:
      "Before you insert 25, point at where you think it will end up after the rotations. Then insert it and press Step to check.",
    goal: { kind: "containsKeys", keys: [10, 20, 25, 30, 50, 70] },
  },
} satisfies BlockContent;
