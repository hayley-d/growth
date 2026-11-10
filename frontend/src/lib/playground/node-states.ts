import type { NodeState } from "@shared/avl";

export const withUnbalanced = (
  states: Readonly<Record<number, NodeState>>,
  unbalanced: readonly number[],
): Record<number, NodeState> => {
  const result = { ...states };
  for (const key of unbalanced) {
    const state = result[key];
    if (state === undefined || state === "visited") result[key] = "unbalanced";
  }
  return result;
};
