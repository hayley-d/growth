import { type GeneratorKey, generatorKeySchema, type PracticeTopic } from "@shared/schemas";

export const practiceTopicKeys: Record<PracticeTopic, readonly GeneratorKey[]> = {
  traversals: ["traversal-order"],
  insertion: ["insert-result"],
  deletion: ["delete-result"],
  rotations: ["predict-rotation"],
  mixed: generatorKeySchema.options,
};
