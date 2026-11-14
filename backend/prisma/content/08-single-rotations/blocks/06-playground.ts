import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "playground",
  position: 6,
  transcript:
    "Start with 30 at the root, 20 on the left and 40 on the right. Insert 10, 5, 50 and 60, pressing Play after each. Inserting 5 makes 20 left-left, so 20 rotates right and 10 moves up. Inserting 60 makes 40 right-right, so 40 rotates left and 50 moves up. The tree ends with 30 at the root, 10 with 5 and 20 on the left, and 50 with 40 and 60 on the right.",
  body: {
    startingKeys: [30, 20, 40],
    allowedOperations: ["insert"],
    instructions:
      "Insert 10, 5, 50, then 60. After each insert, press Play and read the messages. Say which inserts cause a rotation, which node is unbalanced, and whether it rotates right or left.",
    goal: { kind: "containsKeys", keys: [5, 10, 20, 30, 40, 50, 60] },
  },
} satisfies BlockContent;
