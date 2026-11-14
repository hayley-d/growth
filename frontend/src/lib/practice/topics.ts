import type { PracticeTopic } from "@shared/schemas";

export const practiceTopicDetails: Record<PracticeTopic, { label: string; description: string }> = {
  traversals: {
    label: "Traversals",
    description: "Walk the tree and list the nodes in the order you visit them.",
  },
  insertion: {
    label: "Insertion",
    description: "Add a key, then rebalance if the tree tips over.",
  },
  deletion: {
    label: "Deletion",
    description: "Take a key out and say what the tree looks like after.",
  },
  rotations: {
    label: "Rotations",
    description: "Spot the imbalance and pick the rotation that fixes it.",
  },
  mixed: { label: "Mixed", description: "A bit of everything you have unlocked." },
};
