import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "playground",
  position: 3,
  style: "kinesthetic",
  transcript:
    "A small tree with 20 at the root, 10 on the left and 30 on the right. Insert 5, then search for 5. Feel how search walks down the left side. The goal is a tree that still holds 5, 10, 20 and 30.",
  body: {
    startingKeys: [20, 10, 30],
    allowedOperations: ["insert", "search"],
    instructions: "Insert 5, then search for 5. Keep keys 5, 10, 20 and 30 in the tree.",
    goal: { kind: "containsKeys", keys: [5, 10, 20, 30] },
  },
} satisfies BlockContent;
