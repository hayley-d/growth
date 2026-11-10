import type { NodeState } from "@shared/avl";

export const withUnbalanced = (
  states: Readonly<Record<number, NodeState>>,
  unbalanced: readonly number[],
): Record<number, NodeState> => {
  const result = { ...states };
  for (const key of unbalanced) result[key] ??= "unbalanced";
  return result;
};
