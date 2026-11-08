import { type AlgorithmCode, algorithmOf, type StepKey } from "@shared/avl";

export type StepPhase = "walk" | "height" | "rebalance" | "rotate";

const phaseLabels: Record<StepPhase, string> = {
  walk: "Walk the tree",
  height: "Update height",
  rebalance: "Rebalance",
  rotate: "Rotate",
};

export const stepPhases: readonly { phase: StepPhase; label: string }[] = (
  Object.keys(phaseLabels) as StepPhase[]
).map((phase) => ({ phase, label: phaseLabels[phase] }));

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

export const phaseLabel = (phase: StepPhase): string => phaseLabels[phase];
