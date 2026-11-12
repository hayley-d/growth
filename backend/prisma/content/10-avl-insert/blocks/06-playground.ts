import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "playground",
  position: 6,
  transcript:
    "Practice playground. Start with 20 at the root, 10 on the left with 5 under it, and 30 on the right. Insert 3, then press Play and read the messages. Find the first unbalanced node and watch which rotation fixes it. Then insert 25 and see that nothing needs fixing. The goal is a tree that holds 3, 5, 10, 20, 25 and 30.",
  body: {
    startingKeys: [20, 10, 30, 5],
    allowedOperations: ["insert"],
    instructions:
      "Insert 3, then press Play. Read the messages and find the first unbalanced node. Then insert 25.",
    goal: { kind: "containsKeys", keys: [3, 5, 10, 20, 25, 30] },
  },
} satisfies BlockContent;
