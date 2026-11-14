import { useMemo } from "react";

import type { AvlNode } from "@shared/avl";
import type { Replay } from "@shared/schemas";
import { StepControls } from "@/components/molecules/step-controls";
import { StepMessage } from "@/components/molecules/step-message";
import { TreeView } from "@/components/organisms/tree-view";
import { speak } from "@/lib/speak";
import { phaseOf } from "@/lib/step-phases";
import { replaySteps } from "@/lib/test/replay-steps";
import { useStepPlayer } from "@/lib/use-step-player";
import { cn } from "@/lib/utils";

type AnswerReplayProperties = {
  root: AvlNode | null;
  replay: Replay;
  runKey: string;
  className?: string;
};

export function AnswerReplay({ root, replay, runKey, className }: AnswerReplayProperties) {
  const steps = useMemo(() => replaySteps(root, replay), [root, replay]);
  const player = useStepPlayer(steps, runKey);
  const step = player.step;

  if (steps.length === 0) return null;

  return (
    <div className={cn("@container flex min-w-0 flex-col gap-2", className)}>
      <h3 className="text-sm font-medium text-muted-foreground">
        The correct answer, step by step
      </h3>
      <fieldset
        onKeyDown={player.handleKeyDown}
        className="flex min-w-0 flex-col gap-4 @3xl:grid @3xl:grid-cols-2 @3xl:gap-x-6"
      >
        <legend className="sr-only">Replay of the correct answer</legend>
        <div className="h-56 rounded-xl border bg-card p-3 sm:h-72">
          <TreeView root={step?.tree ?? root} nodeStates={step?.nodeStates} className="h-full" />
        </div>
        <div className="flex min-w-0 flex-col gap-4 @3xl:h-72 @3xl:justify-between">
          {step ? (
            <StepMessage
              message={step.message}
              stepNumber={player.index + 1}
              stepCount={player.stepCount}
              onListen={speak}
              className="@3xl:-m-1 @3xl:min-h-0 @3xl:items-start @3xl:overflow-y-auto @3xl:p-1"
            />
          ) : null}
          <StepControls
            player={player}
            phases={steps.map((each) => phaseOf(each.stepKey))}
            className="@3xl:shrink-0"
          />
        </div>
      </fieldset>
    </div>
  );
}
