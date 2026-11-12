import { cn } from "@/lib/utils";

type DifficultyMeterProperties = {
  level: number;
  className?: string;
};

const levels = [1, 2, 3, 4, 5] as const;

export function DifficultyMeter({ level, className }: DifficultyMeterProperties) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-sm", className)}>
      <span className="text-muted-foreground">
        Difficulty<span className="sr-only"> {level} of 5</span>
      </span>
      <span aria-hidden="true" className="flex items-end gap-0.5">
        {levels.map((step) => (
          <span
            key={step}
            className={cn(
              "w-1.5 rounded-sm",
              step <= level ? "bg-primary" : "border border-muted-foreground/50",
            )}
            style={{ height: `${6 + step * 3}px` }}
          />
        ))}
      </span>
    </span>
  );
}
