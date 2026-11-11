import { useMemo } from "react";

import type { NodeState } from "@shared/avl";
import { StepButtons } from "@/components/molecules/step-buttons";
import { TreeView } from "@/components/organisms/tree-view";
import { trimTree } from "@/lib/copy-tree-steps";
import { type DeleteTreeStep, deleteTreeSteps } from "@/lib/delete-tree-steps";
import { useStepPlayer } from "@/lib/use-step-player";
import { cn } from "@/lib/utils";

type DeleteTreeProperties = {
  startingKeys: readonly number[];
  caption: string;
  className?: string;
};

const listKeys = (keys: readonly number[]) =>
  keys.length === 2 ? `${keys[0]} and ${keys[1]}` : `${keys[0]}`;

const messageFor = (step: DeleteTreeStep | null, total: number) => {
  if (!step || step.currentKey === null) return "Press Step to start deleting.";
  const remove =
    step.childKeys.length === 0
      ? `Delete ${step.currentKey}. It has no children.`
      : `Delete ${step.currentKey}. ${listKeys(step.childKeys)} ${step.childKeys.length === 2 ? "are" : "is"} already gone.`;
  return step.deletedKeys.length === total ? `${remove} All ${total} nodes are deleted.` : remove;
};

export function DeleteTree({ startingKeys, caption, className }: DeleteTreeProperties) {
  const runKey = startingKeys.join(",");
  const { root, steps } = useMemo(() => deleteTreeSteps(startingKeys), [startingKeys]);
  const player = useStepPlayer(steps, runKey);
  const { step } = player;
  const total = steps.length - 1;
  const deletedKeys = step?.deletedKeys ?? [];
  const currentKey = step?.currentKey ?? null;
  const shown = useMemo(() => {
    const goneKeys = deletedKeys.filter((key) => key !== currentKey);
    const keys = startingKeys.filter((key) => !goneKeys.includes(key));
    return trimTree(root, keys);
  }, [root, startingKeys, deletedKeys, currentKey]);
  const nodeStates: Record<number, NodeState> =
    currentKey === null ? {} : { [currentKey]: "deleting" };

  return (
    <fieldset
      onKeyDown={player.handleKeyDown}
      className={cn("flex min-w-0 flex-col gap-4", className)}
    >
      <legend className="sr-only">Delete a tree in post-order</legend>
      <p aria-live="polite" className="rounded-md bg-muted px-4 py-3 font-medium text-foreground">
        {messageFor(step, total)}
      </p>

      <div className="h-56 rounded-md border bg-card p-3">
        <TreeView
          root={shown}
          layoutRoot={root}
          nodeStates={nodeStates}
          label={
            deletedKeys.length === 0 ? "Tree, nothing deleted yet" : `Tree, deleting ${currentKey}`
          }
        />
      </div>

      <div className="flex min-h-9 flex-wrap items-center gap-2">
        <span className="text-muted-foreground text-sm">Deleted:</span>
        <ol aria-label="Delete order" className="flex flex-wrap gap-2">
          {deletedKeys.map((key) => (
            <li
              key={key}
              className="rounded-md border bg-background px-2 py-1 font-mono text-foreground text-sm"
            >
              {key}
            </li>
          ))}
        </ol>
      </div>

      <p className="text-center text-muted-foreground text-sm">{caption}</p>

      <StepButtons player={player} total={total} />
    </fieldset>
  );
}
