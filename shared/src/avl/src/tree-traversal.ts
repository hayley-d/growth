import type { AvlNode } from "@shared/avl/src/avl-tree";
import { type SteppedResult, StepRecorder, withinCall } from "@shared/avl/src/step-recorder";

export type TraversalOrder = "preorder" | "inorder" | "postorder" | "levelorder";

type DepthFirstOrder = Exclude<TraversalOrder, "levelorder">;

const visitNode = (
  node: AvlNode,
  order: TraversalOrder,
  nodes: AvlNode[],
  recorder?: StepRecorder,
) => {
  nodes.push(node);
  recorder?.focus(node.key);
  recorder?.emit(`${order}.visit`, {
    node: node.key,
    visited: nodes.length,
  });
};

const collectDepthFirst = (
  node: AvlNode | null,
  order: DepthFirstOrder,
  nodes: AvlNode[],
  recorder?: StepRecorder,
): AvlNode[] =>
  withinCall(recorder, order, node?.key ?? null, () =>
    visitDepthFirst(node, order, nodes, recorder),
  );

const visitDepthFirst = (
  node: AvlNode | null,
  order: DepthFirstOrder,
  nodes: AvlNode[],
  recorder?: StepRecorder,
): AvlNode[] => {
  if (node) recorder?.focus(node.key);
  recorder?.emit(`${order}.check-empty`, { node: node?.key ?? null });
  if (!node) {
    recorder?.emit(`${order}.empty`, { node: null });
    return nodes;
  }
  if (order === "preorder") visitNode(node, order, nodes, recorder);
  recorder?.focus(node.key);
  recorder?.emit(`${order}.go-left`, {
    node: node.key,
  });
  collectDepthFirst(node.left, order, nodes, recorder);
  if (order === "inorder") visitNode(node, order, nodes, recorder);
  recorder?.focus(node.key);
  recorder?.emit(`${order}.go-right`, {
    node: node.key,
  });
  collectDepthFirst(node.right, order, nodes, recorder);
  if (order === "postorder") visitNode(node, order, nodes, recorder);
  return nodes;
};

const collectLevelOrder = (root: AvlNode | null, recorder?: StepRecorder): AvlNode[] => {
  const nodes: AvlNode[] = [];
  const queue: AvlNode[] = root ? [root] : [];
  recorder?.emit("levelorder.enqueue-root", { node: root?.key ?? null, queued: queue.length });
  recorder?.emit("levelorder.check-queue", { queued: queue.length, visited: nodes.length });
  let node = queue.shift();
  while (node) {
    recorder?.focus(node.key);
    recorder?.emit("levelorder.dequeue", { node: node.key, queued: queue.length });
    visitNode(node, "levelorder", nodes, recorder);
    recorder?.emit("levelorder.check-left", { node: node.key, child: node.left?.key ?? null });
    if (node.left) {
      queue.push(node.left);
      recorder?.emit("levelorder.enqueue-left", { node: node.left.key, queued: queue.length });
    }
    recorder?.emit("levelorder.check-right", { node: node.key, child: node.right?.key ?? null });
    if (node.right) {
      queue.push(node.right);
      recorder?.emit("levelorder.enqueue-right", { node: node.right.key, queued: queue.length });
    }
    recorder?.emit("levelorder.check-queue", { queued: queue.length, visited: nodes.length });
    node = queue.shift();
  }
  return nodes;
};

const collect = (root: AvlNode | null, order: TraversalOrder, recorder?: StepRecorder) =>
  order === "levelorder"
    ? withinCall(recorder, "levelorder", root?.key ?? null, () => collectLevelOrder(root, recorder))
    : collectDepthFirst(root, order, [], recorder);

export class TreeTraversal implements Iterable<AvlNode> {
  private readonly nodes: AvlNode[];
  private index = 0;

  constructor(root: AvlNode | null, order: TraversalOrder) {
    this.nodes = collect(root, order);
  }

  next(): AvlNode | null {
    const node = this.nodes[this.index];
    if (!node) return null;
    this.index += 1;
    return node;
  }

  reachedEnd(): boolean {
    return this.index >= this.nodes.length;
  }

  reset(): void {
    this.index = 0;
  }

  *[Symbol.iterator](): Iterator<AvlNode> {
    let node = this.next();
    while (node) {
      yield node;
      node = this.next();
    }
  }
}

export const traceTraversal = (
  root: AvlNode | null,
  order: TraversalOrder,
): SteppedResult<number[]> => {
  const recorder = new StepRecorder(root);
  return recorder.finish(collect(root, order, recorder).map((node) => node.key));
};
