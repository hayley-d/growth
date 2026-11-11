import { useMemo } from "react";

import type { NodeState } from "@shared/avl";
import type { ExpressionNode } from "@shared/schemas";
import { StepButtons } from "@/components/molecules/step-buttons";
import { TreeView } from "@/components/organisms/tree-view";
import {
  type ExpressionOrder,
  type ExpressionTreeStep,
  expressionTreeSteps,
  notationName,
} from "@/lib/expression-tree-steps";
import { useStepPlayer } from "@/lib/use-step-player";
import { cn } from "@/lib/utils";

type ExpressionTreeProperties = {
  expression: ExpressionNode;
  order: ExpressionOrder;
  caption: string;
  className?: string;
};

const nodeStates = (step: ExpressionTreeStep | null) => {
  const states: Record<number, NodeState> = {};
  for (const key of step?.visitedKeys ?? []) {
    states[key] = key === step?.currentKey ? "active" : "visited";
  }
  return states;
};

const capitalise = (word: string) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`;

export function ExpressionTree({
  expression,
  order,
  caption,
  className,
}: ExpressionTreeProperties) {
  const { root, labels, steps } = useMemo(
    () => expressionTreeSteps(expression, order),
    [expression, order],
  );
  const runKey = `${order}:${JSON.stringify(expression)}`;
  const player = useStepPlayer(steps, runKey);
  const { step } = player;
  const total = steps.length - 1;
  const notation = notationName(order);
  const written = (step?.visitedKeys ?? []).map((key) => ({ key, label: labels[key] ?? "" }));

  const message = (() => {
    if (!step || step.currentKey === null) return "Press Step to start.";
    const visit = `Visit ${labels[step.currentKey]}.`;
    const notationText = written.map((item) => item.label).join(" ");
    return step.visitedKeys.length === total
      ? `${visit} The ${notation} notation is ${notationText}.`
      : visit;
  })();

  return (
    <fieldset
      onKeyDown={player.handleKeyDown}
      className={cn("flex min-w-0 flex-col gap-4", className)}
    >
      <legend className="sr-only">Read an expression tree in {notation} order</legend>

      <p aria-live="polite" className="rounded-md bg-muted px-4 py-3 font-medium text-foreground">
        {message}
      </p>

      <div className="h-56 rounded-md border bg-card p-3">
        <TreeView
          root={root}
          nodeLabels={labels}
          nodeStates={nodeStates(step)}
          label={`Expression tree for ${caption}`}
        />
      </div>

      <div className="flex min-h-9 flex-wrap items-center gap-2">
        <span className="text-muted-foreground text-sm">{capitalise(notation)}:</span>
        <ol aria-label="Written so far" className="flex flex-wrap gap-2">
          {written.map((item) => (
            <li
              key={item.key}
              className="rounded-md border bg-background px-2 py-1 font-mono text-foreground text-sm"
            >
              {item.label}
            </li>
          ))}
        </ol>
      </div>

      <p className="text-center text-muted-foreground text-sm">{caption}</p>

      <StepButtons player={player} total={total} />
    </fieldset>
  );
}
