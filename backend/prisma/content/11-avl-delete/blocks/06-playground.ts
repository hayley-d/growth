import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "playground",
  position: 6,
  transcript:
    "Practice playground. Start with 30 at the root, 20 on the left, and 40 on the right with 35 and 50 under it. Delete 20, which is a leaf. Then delete 40, which has two children. Then delete 35. Press Play after each one and read the messages. Look for the delete case, the successor and any rotation.",
  body: {
    startingKeys: [30, 20, 40, 35, 50],
    allowedOperations: ["delete"],
    instructions:
      "Delete 20, then 40, then 35. Press Play after each one and read the messages. Then try other keys.",
  },
} satisfies BlockContent;
