import { useEffect, useMemo, useRef } from "react";

import type { OperationStep } from "@shared/schemas";
import { StepControls } from "@/components/molecules/step-controls";
import { StepMessage } from "@/components/molecules/step-message";
import { TreeView } from "@/components/organisms/tree-view";
import { animationSteps } from "@/lib/lesson/animation-steps";
import { speak } from "@/lib/speak";
import { phaseOf } from "@/lib/step-phases";
import { useMediaQuery } from "@/lib/use-media-query";
import { useStepPlayer } from "@/lib/use-step-player";
import { cn } from "@/lib/utils";

type AnimationBlockProperties = {
  startingKeys: readonly number[];
  operations: readonly OperationStep[];
  autoplay: boolean;
  className?: string;
};

export function AnimationBlock({
  startingKeys,
  operations,
  autoplay,
  className,
}: AnimationBlockProperties) {
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const run = useMemo(() => animationSteps(startingKeys, operations), [startingKeys, operations]);
  const runKey = `${startingKeys.join(",")}|${operations.map((each) => `${each.operation}${each.key}`).join(",")}`;
  const player = useStepPlayer(run.steps, runKey);
  const step = player.step;
  const started = useRef(false);
  const { toggle } = player;

  useEffect(() => {
    if (!autoplay || reduced || started.current) return;
    started.current = true;
    toggle();
  }, [autoplay, reduced, toggle]);

  return (
    <fieldset
      onKeyDown={player.handleKeyDown}
      className={cn("flex min-w-0 flex-col gap-4", className)}
    >
      <legend className="sr-only">Animation</legend>
      <div className="h-56 rounded-xl border bg-card p-3 sm:h-72">
        <TreeView
          root={step?.tree ?? run.startTree}
          nodeStates={step?.nodeStates}
          className="h-full"
        />
      </div>
      {step ? (
        <StepMessage
          message={step.message}
          stepNumber={player.index + 1}
          stepCount={player.stepCount}
          onListen={speak}
        />
      ) : null}
      <StepControls player={player} phases={run.steps.map((each) => phaseOf(each.stepKey))} />
    </fieldset>
  );
}
