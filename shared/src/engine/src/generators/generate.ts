import { generateBalanceFactor } from "@shared/engine/src/generators/balance-factor";
import { generateDeleteResult } from "@shared/engine/src/generators/delete-result";
import { generateHeight } from "@shared/engine/src/generators/height";
import { generateInsertResult } from "@shared/engine/src/generators/insert-result";
import { generateIsAvl } from "@shared/engine/src/generators/is-avl";
import { generatePredictRotation } from "@shared/engine/src/generators/predict-rotation";
import type { GenerateOptions } from "@shared/engine/src/generators/support";
import { generateTraversalOrder } from "@shared/engine/src/generators/traversal-order";
import type { GeneratedQuestion, GeneratorKey } from "@shared/schemas";

export type { Difficulty, GenerateOptions } from "@shared/engine/src/generators/support";

const generators: Record<GeneratorKey, (options: GenerateOptions) => GeneratedQuestion> = {
  "traversal-order": generateTraversalOrder,
  "insert-result": generateInsertResult,
  "delete-result": generateDeleteResult,
  "predict-rotation": generatePredictRotation,
  "balance-factor": generateBalanceFactor,
  height: generateHeight,
  "is-avl": generateIsAvl,
};

const smallestDifficulty = 1;
const largestDifficulty = 5;

export const generate = (key: GeneratorKey, options: GenerateOptions): GeneratedQuestion => {
  if (!Number.isSafeInteger(options.seed) || options.seed < 0) {
    throw new RangeError(`Seed must be a non-negative integer, got ${options.seed}`);
  }
  if (
    !Number.isInteger(options.difficulty) ||
    options.difficulty < smallestDifficulty ||
    options.difficulty > largestDifficulty
  ) {
    throw new RangeError(
      `Difficulty must be an integer from ${smallestDifficulty} to ${largestDifficulty}, got ${options.difficulty}`,
    );
  }
  return generators[key](options);
};
