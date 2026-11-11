import { useMemo } from "react";

import type { NodeState } from "@shared/avl";
import { StepButtons } from "@/components/molecules/step-buttons";
import { TreeView } from "@/components/organisms/tree-view";
import { type TreeHeightsStep, treeHeightsSteps } from "@/lib/tree-heights-steps";
import { useStepPlayer } from "@/lib/use-step-player";
import { cn } from "@/lib/utils";

type TreeHeightsProperties = {
  startingKeys: readonly number[];
  caption: string;
  className?: string;
};

const messageFor = (step: TreeHeightsStep | null, isLast: boolean) => {
  if (!step || step.currentKey === null) return "Press Step to start.";
  const key = step.currentKey;
  const sum = `1 + max(${step.leftHeight}, ${step.rightHeight}) = ${step.heights[key]}`;
  const message =
    step.leftHeight === 0 && step.rightHeight === 0
      ? `${key} is a leaf. Both its children are empty, with height 0, so its height is ${sum}.`
      : `${key}'s left subtree has height ${step.leftHeight} and its right subtree has height ${step.rightHeight}, so its height is ${sum}.`;
  return isLast ? `${message} That's the height of the whole tree.` : message;
};

const nodeStates = (step: TreeHeightsStep | null) => {
  const states: Record<number, NodeState> = {};
  for (const key of Object.keys(step?.heights ?? {}).map(Number)) {
    states[key] = key === step?.currentKey ? "active" : "visited";
  }
  return states;
};

export function TreeHeights({ startingKeys, caption, className }: TreeHeightsProperties) {
  const runKey = startingKeys.join(",");
  const { root, steps } = useMemo(() => treeHeightsSteps(startingKeys), [startingKeys]);
  const player = useStepPlayer(steps, runKey);
  const { step } = player;
  const total = steps.length - 1;
  const done = steps
    .slice(1, player.index + 1)
    .flatMap((item) =>
      item.currentKey === null
        ? []
        : [{ key: item.currentKey, height: item.heights[item.currentKey] }],
    );

  return (
    <fieldset
      onKeyDown={player.handleKeyDown}
      className={cn("flex min-w-0 flex-col gap-4", className)}
    >
      <legend className="sr-only">Work out each node's height in post-order</legend>

      <p aria-live="polite" className="rounded-md bg-muted px-4 py-3 font-medium text-foreground">
        {messageFor(step, player.isLast && total > 0)}
      </p>

      <div className="h-56 rounded-md border bg-card p-3">
        <TreeView
          root={root}
          nodeStates={nodeStates(step)}
          label={
            done.length === 0
              ? "Tree, no heights worked out yet"
              : `Tree, heights worked out for ${done.map((item) => item.key).join(", ")}`
          }
        />
      </div>

      <div className="flex min-h-9 flex-wrap items-center gap-2">
        <span className="text-muted-foreground text-sm">Heights:</span>
        <ol aria-label="Heights so far" className="flex flex-wrap gap-2">
          {done.map((item) => (
            <li
              key={item.key}
              className="rounded-md border bg-background px-2 py-1 font-mono text-foreground text-sm"
            >
              {item.key}: {item.height}
            </li>
          ))}
        </ol>
      </div>

      <p className="text-center text-muted-foreground text-sm">{caption}</p>

      <StepButtons player={player} total={total} />
    </fieldset>
  );
}
