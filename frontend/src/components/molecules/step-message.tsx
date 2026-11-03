import { Volume2 } from "lucide-react";

import { cn } from "@/lib/utils";

type StepMessageProperties = {
  message: string;
  stepNumber: number;
  stepCount: number;
  onListen?: (message: string) => void;
  className?: string;
};

export function StepMessage({
  message,
  stepNumber,
  stepCount,
  onListen,
  className,
}: StepMessageProperties) {
  return (
    <div className={cn("flex items-start gap-3 sm:items-center sm:gap-4", className)}>
      <span className="mt-0.5 inline-flex h-7 shrink-0 items-center rounded-full bg-primary px-2.5 font-mono text-xs font-semibold text-primary-foreground tabular-nums sm:mt-0">
        <span className="sr-only">Step </span>
        {stepNumber}
        <span aria-hidden="true" className="px-0.5 opacity-60">
          /
        </span>
        <span className="sr-only"> of </span>
        {stepCount}
      </span>
      <p aria-live="polite" className="min-w-0 flex-1 text-base text-balance sm:text-lg">
        {message}
      </p>
      {onListen ? (
        <button
          type="button"
          onClick={() => onListen(message)}
          aria-label="Listen to this step"
          className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border-2 border-foreground/80 px-3 text-sm font-semibold transition-colors hover:bg-foreground hover:text-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none motion-reduce:transition-none sm:px-4"
        >
          <Volume2 aria-hidden="true" className="size-4" />
          <span className="hidden sm:inline">Listen</span>
        </button>
      ) : null}
    </div>
  );
}
