import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "animation",
  position: 3,
  transcript:
    "Watch the first three keys go in. 8 goes in first and becomes the root. 4 is smaller than 8, so it goes left. Now 8 is the parent and 4 is its left child. 12 is bigger than 8, so it goes right, as the right child of 8.",
  body: {
    startingKeys: [],
    steps: [
      { operation: "insert", key: 8 },
      { operation: "insert", key: 4 },
      { operation: "insert", key: 12 },
    ],
    autoplay: false,
    markdown:
      "## The first three keys\n\nPress play to watch 8, 4 and 12 go in.\n\n- **8** goes in first, so it becomes the **root**.\n- **4** is smaller than 8, so it goes **left**.\n- **12** is bigger than 8, so it goes **right**.",
  },
} satisfies BlockContent;
