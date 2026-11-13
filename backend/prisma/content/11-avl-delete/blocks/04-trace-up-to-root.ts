import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "code_trace",
  position: 4,
  transcript:
    "Trace a delete that rebalances all the way to the root. The tree has 50 at the root. On the left, 30 has 20 and 40, with 45 under 40. On the right, 70 has 60 and 90, with 55 under 60, 80 and 100 under 90, and 110 under 100. We delete 20, a leaf. Walking up, 30 has a balance factor of minus 2 and its right child leans right, so one left rotation fixes it. But that rotation makes the left side of the tree one level shorter. Now the root 50 has a balance factor of minus 2, and its right child 70 leans right, so a second left rotation fixes the root. A delete keeps going up until it reaches the root.",
  body: {
    algorithmCode: "delete",
    startingKeys: [50, 30, 70, 20, 40, 60, 90, 45, 55, 80, 100, 110],
    operation: { operation: "delete", key: 20 },
    markdown:
      "## Trace a delete up to the root\n\nPress **Step** to run the delete code one line at a time.\n\nWe delete `20`, a leaf. Then the code walks back up through **every** ancestor. Work out each balance factor before you press **Step**. Notice what the first fix does to the height of its subtree, and what that means for the node above.",
  },
} satisfies BlockContent;
