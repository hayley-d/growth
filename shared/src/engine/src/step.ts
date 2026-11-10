import type { AvlNode } from "@shared/avl/src/avl-tree";
import type { NodeState } from "@shared/avl/src/step-recorder";

export type Step = {
  stepKey: string;
  tree: AvlNode | null;
  nodeStates: Record<number, NodeState>;
  message: string;
  variables: Record<string, string | number>;
};
