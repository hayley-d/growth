import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "playground",
  position: 3,
  style: "kinesthetic",
  transcript:
    "A small tree with 20 at the root, 10 on the left and 30 on the right. Every node starts with balance factor 0. Insert 5, then press Play and read the messages. Watch how the balance factor of 10 and of 20 changes. The goal is a tree that still holds 5, 10, 20 and 30.",
  body: {
    startingKeys: [20, 10, 30],
    allowedOperations: ["insert"],
    instructions:
      "Every node starts with balance factor 0. Insert 5, then press Play. Read the messages. Watch how the balance factor of 10 and of 20 changes.",
    goal: { kind: "containsKeys", keys: [5, 10, 20, 30] },
  },
} satisfies BlockContent;
