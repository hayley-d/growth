import { useMemo } from "react";

import type { NodeState } from "@shared/avl";
import { StepButtons } from "@/components/molecules/step-buttons";
import { TreeView } from "@/components/organisms/tree-view";
import { type CopyTreeStep, copyTreeSteps, trimTree } from "@/lib/copy-tree-steps";
import { useTreeMode } from "@/lib/lesson/tree-mode";
import { useStepPlayer } from "@/lib/use-step-player";
import { cn } from "@/lib/utils";

type CopyTreeProperties = {
  startingKeys: readonly number[];
  caption: string;
  className?: string;
};

const messageFor = (step: CopyTreeStep | null, total: number) => {
  if (!step || step.currentKey === null) return "Press Step to start copying.";
  const copy =
    step.parentKey === null
      ? `Copy ${step.currentKey} first. It's the root.`
      : `Copy ${step.currentKey} under ${step.parentKey}.`;
  return step.copiedKeys.length === total ? `${copy} All ${total} nodes are copied.` : copy;
};

const originalStates = (step: CopyTreeStep | null) => {
  const states: Record<number, NodeState> = {};
  for (const key of step?.copiedKeys ?? []) {
    states[key] = key === step?.currentKey ? "active" : "visited";
  }
  return states;
};

const copyStates = (step: CopyTreeStep | null): Record<number, NodeState> =>
  step?.currentKey == null ? {} : { [step.currentKey]: "new" };

export function CopyTree({ startingKeys, caption, className }: CopyTreeProperties) {
  const mode = useTreeMode();
  const runKey = `${mode}|${startingKeys.join(",")}`;
  const { root, steps } = useMemo(() => copyTreeSteps(startingKeys, mode), [startingKeys, mode]);
  const player = useStepPlayer(steps, runKey);
  const { step } = player;
  const total = steps.length - 1;
  const copiedKeys = step?.copiedKeys ?? [];
  const copy = useMemo(() => trimTree(root, copiedKeys), [root, copiedKeys]);

  return (
    <fieldset
      onKeyDown={player.handleKeyDown}
      className={cn("flex min-w-0 flex-col gap-4", className)}
    >
      <legend className="sr-only">Copy a tree in pre-order</legend>
      <p aria-live="polite" className="rounded-md bg-muted px-4 py-3 font-medium text-foreground">
        {messageFor(step, total)}
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2 rounded-md border bg-card p-3">
          <p className="font-medium text-muted-foreground text-sm">Original</p>
          <div className="h-48">
            <TreeView root={root} nodeStates={originalStates(step)} label="Original tree" />
          </div>
        </div>
        <div className="flex flex-col gap-2 rounded-md border bg-card p-3">
          <p className="font-medium text-muted-foreground text-sm">Copy</p>
          <div className="h-48">
            <TreeView
              root={copy}
              layoutRoot={root}
              nodeStates={copyStates(step)}
              label={
                copiedKeys.length === 0
                  ? "Copy so far: empty"
                  : `Copy so far: ${copiedKeys.join(", ")}`
              }
            />
          </div>
        </div>
      </div>

      <div className="flex min-h-9 flex-wrap items-center gap-2">
        <span className="text-muted-foreground text-sm">Copied:</span>
        <ol aria-label="Copy order" className="flex flex-wrap gap-2">
          {copiedKeys.map((key) => (
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
