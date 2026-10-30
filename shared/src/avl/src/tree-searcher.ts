import type { AvlNode } from "@shared/avl/src/avl-tree";
import { type SteppedResult, StepRecorder } from "@shared/avl/src/step-recorder";

export type SearchMove = "left" | "right";

type SearchResult = {
  found: AvlNode | null;
  path: AvlNode[];
  moves: SearchMove[];
};

const search = (root: AvlNode | null, key: number, recorder?: StepRecorder): SearchResult => {
  const path: AvlNode[] = [];
  const moves: SearchMove[] = [];
  let node = root;
  while (node) {
    path.push(node);
    recorder?.focus(node.key);
    recorder?.emit("search.compare", { key, node: node.key });
    if (key === node.key) {
      recorder?.emit("search.found", { key, node: node.key });
      return { found: node, path, moves };
    }
    const move: SearchMove = key < node.key ? "left" : "right";
    recorder?.emit(move === "left" ? "search.go-left" : "search.go-right", { key, node: node.key });
    const child: AvlNode | null = node[move];
    if (!child) break;
    moves.push(move);
    node = child;
  }
  recorder?.emit("search.not-found", { key });
  return { found: null, path, moves };
};

export class TreeSearcher {
  private readonly root: AvlNode | null;

  constructor(root: AvlNode | null) {
    this.root = root;
  }

  solve(key: number): AvlNode | null {
    return search(this.root, key).found;
  }

  getSearchPath(key: number): AvlNode[] {
    return search(this.root, key).path;
  }

  getSearchMoves(key: number): SearchMove[] {
    return search(this.root, key).moves;
  }
}

export const traceSearch = (root: AvlNode | null, key: number): SteppedResult<AvlNode | null> => {
  const recorder = new StepRecorder(root);
  return recorder.finish(search(root, key, recorder).found);
};
