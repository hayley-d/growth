import {
  type AvlNode,
  decodeTree,
  type Step,
  traceInsert,
  traceRemove,
  traceTraversal,
} from "@shared/avl";
import type { Replay } from "@shared/schemas";

export const decodeQuestionTree = (text: string | null): AvlNode | null => {
  if (text === null) return null;
  try {
    return decodeTree(text);
  } catch {
    return null;
  }
};

export const replaySteps = (root: AvlNode | null, replay: Replay): Step[] => {
  if (replay.kind === "traversal") return root ? traceTraversal(root, replay.order).steps : [];
  return replay.operation === "insert"
    ? traceInsert(root, replay.key).steps
    : traceRemove(root, replay.key).steps;
};
