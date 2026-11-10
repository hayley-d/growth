import type { UnitTone } from "@/lib/learning-path/unit-tone";
import { cn } from "@/lib/utils";

type UnitProgressProperties = {
  title: string;
  progress: number;
  unit: UnitTone;
  className?: string;
};

export function UnitProgress({ title, progress, unit, className }: UnitProgressProperties) {
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
        className="h-2 overflow-hidden rounded-full bg-muted"
      >
        <div
          className={cn("h-full", unit === "primary" ? "bg-primary" : "bg-secondary")}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
