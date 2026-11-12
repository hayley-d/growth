import type { PracticeTopic } from "@shared/schemas";

export const practiceTopicDetails: Record<PracticeTopic, { label: string; description: string }> = {
  traversals: { label: "Traversals", description: "List the nodes in the order they are visited." },
  insertion: { label: "Insertion", description: "Insert a key and say what the tree looks like." },
  deletion: { label: "Deletion", description: "Delete a key and say what the tree looks like." },
  rotations: { label: "Rotations", description: "Predict which rotation fixes an imbalance." },
  mixed: { label: "Mixed", description: "A bit of everything you have unlocked." },
};
