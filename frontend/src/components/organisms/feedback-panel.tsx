import { Check, X } from "lucide-react";
import { type ReactNode, useEffect, useRef } from "react";

import type { AvlNode } from "@shared/avl";
import type { Replay } from "@shared/schemas";
import { Button } from "@/components/atoms/button";
import { AnswerReplay } from "@/components/organisms/answer-replay";
import { cn } from "@/lib/utils";

type FeedbackPanelProperties = {
  isCorrect: boolean;
  explanation: string;
  replay: Replay | null;
  root: AvlNode | null;
  runKey: string;
  isLast: boolean;
  onNext: () => void;
  nextLabel?: string;
  children?: ReactNode;
  className?: string;
};

export function FeedbackPanel({
  isCorrect,
  explanation,
  replay,
  root,
  runKey,
  isLast,
  onNext,
  nextLabel,
  children,
  className,
}: FeedbackPanelProperties) {
  const headingReference = useRef<HTMLHeadingElement>(null);
  const Icon = isCorrect ? Check : X;

  useEffect(() => {
    headingReference.current?.focus();
  }, []);

  return (
    <section
      aria-labelledby="feedback-heading"
      className={cn("flex flex-col gap-4 rounded-xl border p-4 sm:p-6", className)}
    >
      <h2
        id="feedback-heading"
        ref={headingReference}
        tabIndex={-1}
        className="flex items-center gap-2 text-xl font-semibold focus-visible:outline-none"
      >
        <span
          className={cn(
            "grid size-8 place-items-center rounded-full border-2",
            isCorrect ? "border-primary text-primary" : "border-destructive text-destructive",
          )}
        >
          <Icon aria-hidden className="size-5" />
        </span>
        {isCorrect ? "Correct" : "Not quite"}
      </h2>
      <p>{explanation}</p>
      {replay ? <AnswerReplay root={root} replay={replay} runKey={runKey} /> : null}
      {children}
      <Button type="button" className="min-h-11 self-end px-6" onClick={onNext}>
        {nextLabel ?? (isLast ? "See results" : "Next")}
      </Button>
    </section>
  );
}
