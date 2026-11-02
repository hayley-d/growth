import type { AvlNode } from "@shared/avl/src/avl-tree";

export type NodeState = "active" | "visited" | "about to be deleted" | "unbalanced" | "new";

export type Step = {
  stepKey: string;
  tree: AvlNode | null;
  nodeStates: Record<number, NodeState>;
  message: string;
  variables: Record<string, string | number>;
};
