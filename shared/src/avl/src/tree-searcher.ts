import type { AvlNode } from "@shared/avl/src/avl-tree";

export type SearchMove = "left" | "right";

type SearchResult = {
  found: AvlNode | null;
  path: AvlNode[];
  moves: SearchMove[];
};

export class TreeSearcher {
  private readonly root: AvlNode | null;

  constructor(root: AvlNode | null) {
    this.root = root;
  }

  solve(key: number): AvlNode | null {
    return this.search(key).found;
  }

  getSearchPath(key: number): AvlNode[] {
    return this.search(key).path;
  }

  getSearchMoves(key: number): SearchMove[] {
    return this.search(key).moves;
  }

  private search(key: number): SearchResult {
    const path: AvlNode[] = [];
    const moves: SearchMove[] = [];
    let node = this.root;
    while (node) {
      path.push(node);
      if (key === node.key) return { found: node, path, moves };
      const move: SearchMove = key < node.key ? "left" : "right";
      const child: AvlNode | null = node[move];
      if (!child) break;
      moves.push(move);
      node = child;
    }
    return { found: null, path, moves };
  }
}
