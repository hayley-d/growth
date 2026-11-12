import type { BlockContent } from "@/infrastructure/course-content/content/content-schema";

export default {
  type: "code_trace",
  position: 3,
  transcript:
    "Trace a delete with a rotation. The tree has 30 at the root, 20 on the left and 40 on the right, with 35 and 50 under 40. We delete 20, which is a leaf. Walking back up, 30 now has nothing on its left and a subtree of height 2 on its right, so its balance factor is minus 2. Its heavy child, 40, has a balance factor of 0. One left rotation at 30 fixes it. Notice that the tree is still three levels tall, like before the delete.",
  body: {
    algorithmCode: "delete",
    startingKeys: [30, 20, 40, 35, 50],
    operation: { operation: "delete", key: 20 },
    markdown:
      "## Trace a delete with a rotation\n\nPress **Step** to run the delete code one line at a time.\n\nWe delete `20`, a leaf. Then the code walks back up. Work out the balance factor of each node **before** you press **Step**. Look at the child on the heavy side too, because it picks the rotation.",
  },
} satisfies BlockContent;
