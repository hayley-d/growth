import { useMemo } from "react";

import {
  type AlgorithmCode,
  type AvlNode,
  isAlgorithmCode,
  type Step,
  type TraversalOrder,
  type TreeMode,
  traceTraversal,
} from "@shared/avl";
import type { CodeTraceOperation } from "@shared/schemas";
import { CallStack } from "@/components/molecules/call-stack";
import { StepControls } from "@/components/molecules/step-controls";
import { StepMessage } from "@/components/molecules/step-message";
import { CodeTrace } from "@/components/organisms/code-trace";
import { TraceLayout } from "@/components/organisms/trace-layout";
import { TreeView } from "@/components/organisms/tree-view";
import { buildTree, traceTreeOperation } from "@/lib/lesson/animation-steps";
import { useTreeMode } from "@/lib/lesson/tree-mode";
import { usePlaygroundSnippets } from "@/lib/playground/use-playground-snippets";
import { speak } from "@/lib/speak";
import { phaseOf } from "@/lib/step-phases";
import { useStepPlayer } from "@/lib/use-step-player";
import { cn } from "@/lib/utils";

const traversalOrders: readonly string[] = ["preorder", "inorder", "postorder", "levelorder"];

const avlCodes: readonly AlgorithmCode[] = [
  "insert",
  "delete",
  "search",
  "rotate-left",
  "rotate-right",
  "rebalance",
  "update-height",
];

const traceSteps = (
  root: AvlNode | null,
  algorithmCode: string,
  operation: CodeTraceOperation,
  mode: TreeMode,
): Step[] => {
  if (operation.operation === "traverse") {
    return traversalOrders.includes(algorithmCode)
      ? traceTraversal(root, algorithmCode as TraversalOrder).steps
      : [];
  }
  return traceTreeOperation(root, operation, mode).steps;
};

type CodeTraceBlockProperties = {
  algorithmCode: string;
  startingKeys: readonly number[];
  operation: CodeTraceOperation;
  showCode?: boolean;
  className?: string;
};

export function CodeTraceBlock({
  algorithmCode,
  startingKeys,
  operation,
  showCode = true,
  className,
}: CodeTraceBlockProperties) {
  const mode = useTreeMode();
  const root = useMemo(() => buildTree(startingKeys, mode), [startingKeys, mode]);
  const steps = useMemo(
    () => traceSteps(root, algorithmCode, operation, mode),
    [root, algorithmCode, operation, mode],
  );
  const codes = useMemo<readonly AlgorithmCode[]>(
    () =>
      operation.operation === "traverse" && isAlgorithmCode(algorithmCode)
        ? [algorithmCode]
        : avlCodes,
    [operation.operation, algorithmCode],
  );
  const code = usePlaygroundSnippets(codes);
  const runKey = `${algorithmCode}|${startingKeys.join(",")}|${JSON.stringify(operation)}`;
  const player = useStepPlayer(steps, runKey);
  const step = player.step;

  const treeView = (
    <div className="h-64 w-full self-start sm:h-80">
      <TreeView root={step?.tree ?? root} nodeStates={step?.nodeStates} className="h-full" />
    </div>
  );
  const message = step ? (
    <StepMessage
      message={step.message}
      stepNumber={player.index + 1}
      stepCount={player.stepCount}
      onListen={speak}
    />
  ) : (
    <p className="text-muted-foreground">There's nothing to trace here.</p>
  );
  const controls =
    steps.length > 0 ? (
      <StepControls player={player} phases={steps.map((each) => phaseOf(each.stepKey))} />
    ) : undefined;

  if (!showCode) {
    return (
      <div className={cn("overflow-hidden rounded-2xl border bg-card", className)}>
        <div className="grid gap-4 p-4 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] sm:gap-6 sm:p-6">
          {treeView}
          <CallStack frames={step?.callStack ?? []} language={code.language} />
        </div>
        <div className="border-t bg-muted/40 px-4 py-4 sm:px-6">{message}</div>
        {controls ? <div className="border-t px-4 py-3 sm:px-6">{controls}</div> : null}
      </div>
    );
  }

  return (
    <TraceLayout
      className={className}
      tree={treeView}
      code={
        <CodeTrace
          step={step}
          snippets={code.snippets}
          language={code.language}
          learnerLanguage={code.learnerLanguage}
          onLanguageChange={code.setLanguage}
          isLoading={code.isLoading}
        />
      }
      message={message}
      controls={controls}
    />
  );
}
