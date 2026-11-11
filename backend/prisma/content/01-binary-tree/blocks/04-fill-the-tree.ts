import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "animation",
  position: 4,
  transcript:
    "Now four more keys. 2 is smaller than 8 and smaller than 4, so it goes left of 4. 6 is smaller than 8 but bigger than 4, so it goes right of 4. 10 is bigger than 8 but smaller than 12, so it goes left of 12. 14 is bigger than 8 and bigger than 12, so it goes right of 12. Every key started at the root and went left or right until it found an empty spot.",
  body: {
    startingKeys: [8, 4, 12],
    steps: [
      { operation: "insert", key: 2 },
      { operation: "insert", key: 6 },
      { operation: "insert", key: 10 },
      { operation: "insert", key: 14 },
    ],
    autoplay: false,
    markdown:
      "## Fill the tree\n\nNow add 2, 6, 10 and 14. Each key starts at the root and goes left or right until it finds an empty spot.\n\n- **2** is smaller than 8 and smaller than 4, so it goes left of 4.\n- **6** is smaller than 8 but bigger than 4, so it goes right of 4.\n- **10** is bigger than 8 but smaller than 12, so it goes left of 12.\n- **14** is bigger than 8 and bigger than 12, so it goes right of 12.",
  },
} satisfies BlockContent;
