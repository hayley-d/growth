import { Play } from "lucide-react";

import { cn } from "@/lib/utils";

type ContinueCardProperties = {
  unitTitle: string;
  lessonTitle: string;
  summary: string;
  hasStarted: boolean;
  isStarting: boolean;
  errorMessage: string | null;
  onContinue: () => void;
  className?: string;
};

export function ContinueCard({
  unitTitle,
  lessonTitle,
  summary,
  hasStarted,
  isStarting,
  errorMessage,
  onContinue,
  className,
}: ContinueCardProperties) {
  return (
    <div className={cn("flex flex-col gap-4 rounded-lg border p-4 sm:p-6", className)}>
      <div className="flex flex-col gap-1">
        <p className="text-sm text-muted-foreground">{unitTitle}</p>
        <h3 className="text-xl font-semibold">{lessonTitle}</h3>
        <p className="text-sm text-muted-foreground">{summary}</p>
      </div>
      {errorMessage ? (
        <p role="alert" className="text-sm text-destructive">
          {errorMessage}
        </p>
      ) : null}
      <button
        type="button"
        onClick={onContinue}
        disabled={isStarting}
        className="inline-flex min-h-11 w-fit items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:opacity-60"
      >
        <Play aria-hidden className="size-4" />
        {isStarting ? "Opening..." : `${hasStarted ? "Continue" : "Start"}: ${lessonTitle}`}
      </button>
    </div>
  );
}
