import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "playground",
  position: 5,
  transcript:
    "Practice playground. Start with 20 at the root, 10 on the left and 30 on the right. Insert 5 and 25 so the tree holds 5, 10, 20, 25 and 30. You may also search. AVL insert keeps the tree balanced while you work.",
  body: {
    startingKeys: [20, 10, 30],
    allowedOperations: ["insert", "search"],
    instructions:
      "Insert 5 and 25. The tree must hold 5, 10, 20, 25 and 30. Use search if you want to check a key.",
    goal: { kind: "containsKeys", keys: [5, 10, 20, 25, 30] },
  },
} satisfies BlockContent;
