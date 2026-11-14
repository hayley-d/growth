import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "playground",
  position: 8,
  transcript:
    "A tree with only 8 in it. Insert 4, 12, 2, 6, 10 and 14 and watch where each key goes. Smaller keys go left and bigger keys go right.",
  body: {
    startingKeys: [8],
    allowedOperations: ["insert"],
    instructions:
      "Insert 4, 12, 2, 6, 10 and 14, then try your own keys. Smaller goes left, bigger goes right.",
    goal: { kind: "containsKeys", keys: [8, 4, 12, 2, 6, 10, 14] },
  },
} satisfies BlockContent;
