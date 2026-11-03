import { type AlgorithmCode, algorithmOf, type StepKey } from "@shared/avl";

export type StepPhase = "walk" | "height" | "rebalance" | "rotate";

export const stepPhases: readonly { phase: StepPhase; label: string }[] = [
  { phase: "walk", label: "Walk the tree" },
  { phase: "height", label: "Update height" },
  { phase: "rebalance", label: "Rebalance" },
  { phase: "rotate", label: "Rotate" },
];

const phaseByAlgorithm: Record<AlgorithmCode, StepPhase> = {
  insert: "walk",
  delete: "walk",
  search: "walk",
  preorder: "walk",
  inorder: "walk",
  postorder: "walk",
  levelorder: "walk",
  "update-height": "height",
  rebalance: "rebalance",
  "rotate-left": "rotate",
  "rotate-right": "rotate",
};

export const phaseOf = (stepKey: StepKey): StepPhase => phaseByAlgorithm[algorithmOf(stepKey)];

export const phaseLabel = (phase: StepPhase): string =>
  stepPhases.find((option) => option.phase === phase)?.label ?? phase;
