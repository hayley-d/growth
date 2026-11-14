import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "playground",
  position: 5,
  transcript:
    "Practice playground. Start with 20 at the root, 10 on the left and 30 on the right. Insert 5, then 25, so the tree holds 5, 10, 20, 25 and 30. After each insert, press Play and read the messages. Watch how the balance factor of the new node's parent changes. AVL insert keeps the tree balanced while you work.",
  body: {
    startingKeys: [20, 10, 30],
    allowedOperations: ["insert"],
    instructions:
      "Insert 5, then 25. After each insert, press Play and read the messages. Watch how the balance factor of the new node's parent changes.",
    goal: { kind: "containsKeys", keys: [5, 10, 20, 25, 30] },
  },
} satisfies BlockContent;
