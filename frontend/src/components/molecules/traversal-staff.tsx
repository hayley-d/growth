import type { WrongTap } from "@/lib/lesson/traversal-taps";
import { cn } from "@/lib/utils";

type TraversalStaffProperties = {
  beats: number;
  placed: readonly number[];
  wrong: readonly WrongTap[];
  className?: string;
};

export function TraversalStaff({ beats, placed, wrong, className }: TraversalStaffProperties) {
  return (
    <ol
      aria-label="Your order"
      className={cn("flex flex-wrap items-end gap-x-2 gap-y-4 border-b-2 pb-2", className)}
    >
      {Array.from({ length: beats }, (_, beat) => beat).map((beat) => {
        const key = placed[beat];
        const misses = wrong.filter((tap) => tap.beat === beat);
        return (
          <li key={beat} className="flex w-12 flex-col items-center gap-1">
            <span className="flex min-h-5 flex-wrap justify-center gap-1">
              {misses.map((tap) => (
                <s
                  key={`${tap.beat}-${tap.key}`}
                  className="font-mono text-xs text-destructive decoration-2"
                >
                  {tap.key}
                  <span className="sr-only"> was wrong</span>
                </s>
              ))}
            </span>
            <span
              className={cn(
                "grid size-11 place-items-center rounded-full border-2 font-mono font-semibold tabular-nums",
                key === undefined
                  ? "border-dashed border-muted-foreground text-muted-foreground"
                  : "border-primary bg-primary text-primary-foreground",
              )}
            >
              {key ?? <span className="sr-only">empty</span>}
            </span>
            <span className="text-xs text-muted-foreground tabular-nums">
              <span className="sr-only">beat </span>
              {beat + 1}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
