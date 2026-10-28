import type { AvlNode } from "@shared/avl/src/avl-tree";

export type TraversalOrder = "preorder" | "inorder" | "postorder";

const collect = (node: AvlNode | null, order: TraversalOrder, nodes: AvlNode[]): AvlNode[] => {
  if (!node) return nodes;
  if (order === "preorder") nodes.push(node);
  collect(node.left, order, nodes);
  if (order === "inorder") nodes.push(node);
  collect(node.right, order, nodes);
  if (order === "postorder") nodes.push(node);
  return nodes;
};

export class TreeTraversal implements Iterable<AvlNode> {
  private readonly nodes: AvlNode[];
  private index = 0;

  constructor(root: AvlNode | null, order: TraversalOrder) {
    this.nodes = collect(root, order, []);
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
