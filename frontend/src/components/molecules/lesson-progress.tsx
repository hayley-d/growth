import { motion } from "motion/react";
import { useState } from "react";

import { useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";

type LessonProgressProperties = {
  stepNumber: number;
  totalSteps: number;
  finished: boolean;
  className?: string;
};

const glowSeconds = 0.7;

export function LessonProgress({
  stepNumber,
  totalSteps,
  finished,
  className,
}: LessonProgressProperties) {
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [previousStep, setPreviousStep] = useState(stepNumber);
  const [glowFrom, setGlowFrom] = useState<number | null>(null);
  if (stepNumber !== previousStep) {
    setPreviousStep(stepNumber);
    setGlowFrom(stepNumber > previousStep ? previousStep : null);
  }
  const done = finished ? totalSteps : stepNumber;
  const percent = totalSteps === 0 ? 0 : (done / totalSteps) * 100;
  const fromPercent =
    totalSteps === 0 || glowFrom === null ? 0 : (Math.min(glowFrom, totalSteps) / totalSteps) * 100;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        role="progressbar"
        aria-label="Lesson progress"
        aria-valuemin={0}
        aria-valuemax={totalSteps}
        aria-valuenow={done}
        aria-valuetext={finished ? "Lesson finished" : `Step ${stepNumber} of ${totalSteps}`}
        className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-muted"
      >
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-primary"
          initial={false}
          animate={{ width: `${percent}%` }}
          transition={{ duration: reduced ? 0 : glowSeconds, ease: "easeOut" }}
        />
        {glowFrom !== null && !reduced ? (
          <motion.span
            key={stepNumber}
            aria-hidden="true"
            className="absolute inset-y-0 w-10 -translate-x-1/2 rounded-full bg-primary-foreground/70 blur-[3px]"
            initial={{ left: `${fromPercent}%`, opacity: 1 }}
            animate={{ left: `${percent}%`, opacity: 0 }}
            transition={{ duration: glowSeconds, ease: "easeOut" }}
          />
        ) : null}
      </div>
      <span className="shrink-0 font-mono text-sm text-muted-foreground tabular-nums">
        {done}/{totalSteps}
      </span>
    </div>
  );
}
