import type { StepKey } from "@shared/avl/src/algorithm-steps";
import type { AvlNode } from "@shared/avl/src/avl-tree";
import { describeStep, type StepMessageVariables } from "@shared/avl/src/step-messages";

export type NodeState = "active" | "visited" | "deleting" | "unbalanced" | "new";

export type StepVariables = Record<string, number | string | boolean | null>;

export type Step = {
  stepKey: StepKey;
  tree: AvlNode | null;
  nodeStates: Readonly<Record<number, NodeState>>;
  message: string;
  variables: StepVariables;
};

export type SteppedResult<Result> = {
  result: Result;
  steps: Step[];
};

type Direction = "left" | "right";

const spliceAt = (
  node: AvlNode | null,
  path: readonly Direction[],
  subtree: AvlNode | null,
): AvlNode | null => {
  const [direction, ...rest] = path;
  if (!direction || !node) return subtree;
  return { ...node, [direction]: spliceAt(node[direction], rest, subtree) };
};

const collectKeys = (node: AvlNode | null, keys: Set<number>): Set<number> => {
  if (!node) return keys;
  keys.add(node.key);
  collectKeys(node.left, keys);
  return collectKeys(node.right, keys);
};

export class StepRecorder {
  readonly steps: Step[] = [];
  private tree: AvlNode | null;
  private readonly path: Direction[] = [];
  private readonly states = new Map<number, NodeState>();
  private activeKey: number | null = null;
  private newKey: number | null = null;
  private snapshot: Readonly<Record<number, NodeState>> = Object.freeze({});
  private changed = false;

  constructor(tree: AvlNode | null) {
    this.tree = tree;
  }

  enter(direction: Direction): void {
    this.path.push(direction);
  }

  leave(): void {
    this.path.pop();
  }

  replace(subtree: AvlNode | null): void {
    this.tree = spliceAt(this.tree, this.path, subtree);
    const keys = collectKeys(this.tree, new Set());
    for (const key of this.states.keys()) {
      if (!keys.has(key)) this.clear(key);
    }
  }

  focus(key: number): void {
    this.demote(this.activeKey, "active");
    this.demote(this.newKey, "new");
    this.newKey = null;
    this.activeKey = key;
    this.set(key, "active");
  }

  mark(key: number, state: NodeState): void {
    if (state === "new") this.newKey = key;
    this.set(key, state);
  }

  clear(key: number): void {
    if (!this.states.delete(key)) return;
    if (this.activeKey === key) this.activeKey = null;
    if (this.newKey === key) this.newKey = null;
    this.changed = true;
  }

  emit<Key extends StepKey>(stepKey: Key, variables: StepMessageVariables<Key>): void {
    if (this.changed) {
      this.snapshot = Object.freeze(Object.fromEntries(this.states));
      this.changed = false;
    }
    this.steps.push({
      stepKey,
      tree: this.tree,
      nodeStates: this.snapshot,
      message: describeStep(stepKey, variables),
      variables,
    });
  }

  finish<Result>(result: Result): SteppedResult<Result> {
    return { result, steps: this.steps };
  }

  private demote(key: number | null, from: NodeState): void {
    if (key !== null && this.states.get(key) === from) this.set(key, "visited");
  }

  private set(key: number, state: NodeState): void {
    if (this.states.get(key) === state) return;
    this.states.set(key, state);
    this.changed = true;
  }
}
