import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "diagram",
  position: 1,
  style: "visual",
  transcript: "A tree with 20 at the root, 10 on the left and 30 on the right.",
  body: {
    startingKeys: [20, 10, 30],
    highlights: [{ key: 20, state: "active" }],
    caption: "The root is at the top.",
  },
} satisfies BlockContent;
