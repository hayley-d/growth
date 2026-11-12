import {
  type AvlNode,
  buildTreeFromKeys,
  type Step,
  type TreeMode,
  traceBstInsert,
  traceBstRemove,
  traceInsert,
  traceRemove,
  traceSearch,
} from "@shared/avl";
import type { OperationStep } from "@shared/schemas";

export type AnimationMark = {
  operation: OperationStep;
  startIndex: number;
  endIndex: number;
};

export type AnimationRun = {
  startTree: AvlNode | null;
  steps: Step[];
  marks: AnimationMark[];
};

export const buildTree = (keys: readonly number[], mode: TreeMode = "avl") =>
  buildTreeFromKeys(keys, mode);

export const traceTreeOperation = (
  tree: AvlNode | null,
  operation: OperationStep,
  mode: TreeMode = "avl",
) => {
  if (operation.operation === "insert") {
    return mode === "bst" ? traceBstInsert(tree, operation.key) : traceInsert(tree, operation.key);
  }
  if (operation.operation === "delete") {
    return mode === "bst" ? traceBstRemove(tree, operation.key) : traceRemove(tree, operation.key);
  }
  return traceSearch(tree, operation.key);
};

export const animationSteps = (
  startingKeys: readonly number[],
  operations: readonly OperationStep[],
  mode: TreeMode = "avl",
): AnimationRun => {
  const startTree = buildTree(startingKeys, mode);
  const steps: Step[] = [];
  const marks: AnimationMark[] = [];
  let tree = startTree;
  for (const operation of operations) {
    const traced = traceTreeOperation(tree, operation, mode);
    if (traced.steps.length === 0) continue;
    marks.push({
      operation,
      startIndex: steps.length,
      endIndex: steps.length + traced.steps.length - 1,
    });
    steps.push(...traced.steps);
    if (operation.operation !== "search") tree = traced.result;
  }
  return { startTree, steps, marks };
};

export const operationLabel = (operation: OperationStep) => {
  if (operation.operation === "insert") return `insert ${operation.key}`;
  if (operation.operation === "delete") return `delete ${operation.key}`;
  return `search for ${operation.key}`;
};
