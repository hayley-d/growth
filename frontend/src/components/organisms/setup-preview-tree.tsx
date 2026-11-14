import { Sprout } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { type AvlNode, insertKey, type NodeState, TreeTraversal, toKeys } from "@shared/avl";
import { TreeView } from "@/components/organisms/tree-view";
import { type PlaygroundSearch, startTree } from "@/lib/playground/setup";
import { useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";

type SetupPreviewTreeProperties = {
  answers: PlaygroundSearch;
  className?: string;
};

const pointerStepMs = 650;

const seedling: AvlNode = { key: 30, height: 1, left: null, right: null };

const sampleTree = [30, 20, 40, 10, 25].reduce<AvlNode | null>(
  (tree, key) => insertKey(tree, key),
  null,
);

const previewTree = (answers: PlaygroundSearch): AvlNode | null => {
  if (answers.start) {
    return startTree({ start: answers.start, seed: answers.seed ?? 1, topic: answers.topic });
  }
  return answers.topic ? sampleTree : seedling;
};

const pathToLargest = (tree: AvlNode | null): number[] => {
  const keys: number[] = [];
  let node = tree;
  while (node) {
    keys.push(node.key);
    node = node.right;
  }
  return keys;
};

const lastLeaf = (tree: AvlNode | null): number | null => {
  let node = tree;
  while (node?.left || node?.right) node = node.left ?? node.right;
  return node?.key ?? null;
};

const columnWidth = 64;

export function SetupPreviewTree({ answers, className }: SetupPreviewTreeProperties) {
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const tree = useMemo(() => previewTree(answers), [answers]);
  const walk = useMemo(() => {
    if (answers.topic === "traversal" && answers.traversal) {
      return [...new TreeTraversal(tree, answers.traversal)].map((node) => node.key);
    }
    return answers.topic === "avl" ? pathToLargest(tree) : [];
  }, [answers.topic, answers.traversal, tree]);
  const watching = answers.explore === "watch" && !reduced && walk.length > 0;
  const runSignature = `${answers.explore}:${walk.join(",")}`;
  const [pointer, setPointer] = useState({ runSignature, index: 0 });
  const index = pointer.runSignature === runSignature ? pointer.index : 0;

  useEffect(() => {
    if (!watching) return;
    setPointer({ runSignature, index: 0 });
    const timer = window.setInterval(() => {
      setPointer((current) => {
        if (current.index >= walk.length - 1) {
          window.clearInterval(timer);
          return current;
        }
        return { runSignature, index: current.index + 1 };
      });
    }, pointerStepMs);
    return () => window.clearInterval(timer);
  }, [runSignature, walk.length, watching]);

  const nodeStates = useMemo(() => {
    const states: Record<number, NodeState> = {};
    const shown = watching ? walk.slice(0, index + 1) : walk;
    const isWalk = answers.topic === "traversal";
    if (!isWalk && !watching) return states;
    for (const key of shown) states[key] = "visited";
    const current = shown.at(-1);
    if (watching && current !== undefined) states[current] = "active";
    return states;
  }, [answers.topic, index, walk, watching]);

  const selectedKey = answers.explore === "interact" ? lastLeaf(tree) : null;
  const nodeCount = toKeys(tree).length;
  const order = answers.topic === "traversal" ? walk : [];

  return (
    <figure
      className={cn(
        "flex flex-col gap-4 rounded-3xl border-2 border-dashed bg-muted/40 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:18px_18px] p-5 sm:p-7",
        className,
      )}
    >
      <div className="relative grid h-40 place-items-center sm:h-72">
        {tree ? (
          <div
            className="absolute inset-0 mx-auto"
            style={{ maxWidth: `${(nodeCount + 1) * columnWidth}px` }}
          >
            <TreeView
              root={tree}
              nodeStates={nodeStates}
              showBalance={answers.topic === "avl"}
              selectedKey={selectedKey}
              className="max-h-full"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-center text-muted-foreground">
            <span className="grid size-16 place-items-center rounded-full border-2 border-dashed border-foreground/40 bg-background">
              <Sprout aria-hidden="true" className="size-7 text-primary" />
            </span>
            <span className="max-w-48 text-sm">An empty tree. Your first key goes here.</span>
          </div>
        )}
      </div>
      <figcaption className="flex flex-col gap-3 text-sm text-muted-foreground">
        {order.length > 0 ? (
          <ol aria-hidden="true" className="flex flex-wrap gap-1.5">
            {order.map((key, position) => (
              <li
                key={key}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border bg-background py-0.5 pr-2.5 pl-1 font-medium text-foreground tabular-nums transition-opacity duration-300 motion-reduce:transition-none",
                  watching && position > index && "opacity-40",
                )}
              >
                <span className="grid size-5 place-items-center rounded-full bg-primary text-[0.7rem] font-semibold text-primary-foreground">
                  {position + 1}
                </span>
                {key}
              </li>
            ))}
          </ol>
        ) : null}
      </figcaption>
    </figure>
  );
}
