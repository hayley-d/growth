import { Lightbulb } from "lucide-react";

import type { AttemptQuestion, LearnerAnswer } from "@shared/schemas";
import { Button } from "@/components/atoms/button";
import { MultipleChoiceQuestion } from "@/components/molecules/multiple-choice-question";
import { TextQuestion } from "@/components/molecules/text-question";
import { BuildTreeQuestion } from "@/components/organisms/build-tree-question";
import { OrderNodesQuestion } from "@/components/organisms/order-nodes-question";
import { PredictRotationQuestion } from "@/components/organisms/predict-rotation-question";
import { TreeView } from "@/components/organisms/tree-view";
import { decodeQuestionTree } from "@/lib/test/replay-steps";
import { cn } from "@/lib/utils";

type QuestionCardProperties = {
  question: AttemptQuestion;
  isBusy: boolean;
  errorMessage?: string | null;
  onHint?: () => void;
  onSubmit: (answer: LearnerAnswer) => void;
  hintNote?: string | null;
  className?: string;
};

export function QuestionCard({
  question,
  isBusy,
  errorMessage,
  onHint,
  onSubmit,
  hintNote = "Using hints lowers your score.",
  className,
}: QuestionCardProperties) {
  const root = decodeQuestionTree(question.tree);

  return (
    <section aria-labelledby="question-prompt" className={cn("flex flex-col gap-4", className)}>
      <h2 id="question-prompt" className="text-lg font-semibold">
        {question.prompt}
      </h2>
      {question.hints.length > 0 ? (
        <ol aria-label="Hints" className="flex flex-col gap-2">
          {question.hints.map((hint, index) => (
            <li key={hint} className="flex gap-2 rounded-md border border-dashed p-3 text-sm">
              <Lightbulb aria-hidden className="mt-0.5 size-4 shrink-0" />
              <span>
                <span className="font-medium">Hint {index + 1}:</span> <span>{hint}</span>
              </span>
            </li>
          ))}
        </ol>
      ) : null}
      {question.type === "multiple_choice" || question.type === "text" ? (
        root ? (
          <div className="h-56 rounded-xl border bg-card p-3 sm:h-72">
            <TreeView root={root} className="h-full" />
          </div>
        ) : null
      ) : null}
      {question.type === "multiple_choice" ? (
        <MultipleChoiceQuestion
          key={question.id}
          options={question.options ?? []}
          disabled={isBusy}
          onSubmit={onSubmit}
        />
      ) : null}
      {question.type === "text" ? (
        <TextQuestion key={question.id} disabled={isBusy} onSubmit={onSubmit} />
      ) : null}
      {question.type === "build_tree" ? (
        <BuildTreeQuestion key={question.id} root={root} disabled={isBusy} onSubmit={onSubmit} />
      ) : null}
      {question.type === "order_nodes" ? (
        <OrderNodesQuestion key={question.id} root={root} disabled={isBusy} onSubmit={onSubmit} />
      ) : null}
      {question.type === "predict_rotation" ? (
        <PredictRotationQuestion
          key={question.id}
          root={root}
          disabled={isBusy}
          onSubmit={onSubmit}
        />
      ) : null}
      <div className="flex flex-col items-start gap-2 border-t pt-4">
        {onHint ? (
          <>
            <Button
              type="button"
              variant="subtle"
              className="min-h-11"
              disabled={isBusy || question.hintsRemaining === 0}
              onClick={onHint}
            >
              <Lightbulb aria-hidden />
              Hint ({question.hintsRemaining} left)
            </Button>
            {hintNote ? <p className="text-sm text-muted-foreground">{hintNote}</p> : null}
          </>
        ) : null}
        {errorMessage ? (
          <p role="alert" className="text-sm text-destructive">
            {errorMessage}
          </p>
        ) : null}
      </div>
    </section>
  );
}
