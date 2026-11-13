import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "playground",
  position: 4,
  style: "kinesthetic",
  transcript:
    "Count the rotations. The tree starts with 30 at the root and 10 on its left. Insert 20 and press Step, counting the rotations. There are two, because the path turns. Press Start again, insert 5 and count again. There is one, because the path is straight: left, then left.",
  body: {
    startingKeys: [30, 10],
    allowedOperations: ["insert"],
    instructions:
      "Insert 20 and count the rotations as you press Step. Then press Start again, insert 5 and count again. Why is the count different?",
  },
} satisfies BlockContent;
