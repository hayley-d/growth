import type { UnitTone } from "@/lib/learning-path/unit-tone";
import { cn } from "@/lib/utils";

type UnitProgressProperties = {
  title: string;
  progress: number;
  tone: UnitTone;
  completed: number;
  total: number;
  className?: string;
};

const fillClasses: Record<UnitTone, string> = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  accent: "bg-accent",
};

const filledDotClasses: Record<UnitTone, string> = {
  primary: "bg-primary-foreground",
  secondary: "bg-secondary-foreground",
  accent: "bg-accent-foreground",
};

export function UnitProgress({
  title,
  progress,
  tone,
  completed,
  total,
  className,
}: UnitProgressProperties) {
  const dots = Array.from({ length: total }, (_, index) => ({
    position: index + 1,
    isDone: index < completed,
  }));

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex items-baseline justify-between gap-2 text-sm">
        <span className="font-medium">{title}</span>
        <span className="text-muted-foreground tabular-nums">{progress}%</span>
      </div>
      <div
        role="progressbar"
        aria-label={`${title} progress`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        className="relative h-4 overflow-hidden rounded-full border border-muted-foreground/40 bg-muted"
      >
        {progress > 0 ? (
          <div
            className={cn("h-full rounded-full border border-foreground/60", fillClasses[tone])}
            style={{ width: `${progress}%` }}
          />
        ) : null}
        <div aria-hidden="true" className="absolute inset-0 flex items-center">
          {dots.map((dot) => (
            <span key={dot.position} className="flex flex-1 justify-center">
              <span
                data-done={dot.isDone}
                className={cn(
                  "size-1.5 rounded-full",
                  dot.isDone ? filledDotClasses[tone] : "bg-muted-foreground/60",
                )}
              />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
