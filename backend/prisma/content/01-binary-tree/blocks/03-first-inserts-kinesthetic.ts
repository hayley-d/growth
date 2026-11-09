import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "playground",
  position: 3,
  style: "kinesthetic",
  transcript:
    "A tree with only 8 in it. Insert 4 and 12. 4 is smaller than 8, so it goes left. 12 is bigger than 8, so it goes right.",
  body: {
    startingKeys: [8],
    allowedOperations: ["insert"],
    instructions: "Insert 4 and 12. Smaller goes left, bigger goes right.",
    goal: { kind: "containsKeys", keys: [8, 4, 12] },
  },
} satisfies BlockContent;
