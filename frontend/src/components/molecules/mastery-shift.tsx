import { motion } from "motion/react";

import { masteryLabel } from "@shared/schemas";
import { useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";

type MasteryShiftProperties = {
  title: string;
  before: number;
  after: number;
  className?: string;
};

export function MasteryShift({ title, before, after, className }: MasteryShiftProperties) {
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const low = Math.min(before, after);
  const gained = after > before;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <p className="flex flex-wrap items-baseline justify-between gap-x-3 text-sm">
        <span className="font-medium">{title}</span>
        <span className="text-muted-foreground">
          {before}% to <span className="font-semibold text-foreground">{after}%</span>,{" "}
          {masteryLabel(after).toLowerCase()}
        </span>
      </p>
      <div
        role="progressbar"
        aria-label={`${title} mastery`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={after}
        aria-valuetext={`${before}% to ${after}%`}
        className="relative h-2.5 w-full overflow-hidden rounded-full bg-muted"
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-primary/40"
          style={{ width: `${low}%` }}
        />
        <motion.div
          data-change={gained ? "gain" : "loss"}
          className={cn(
            "absolute inset-y-0 rounded-full",
            gained
              ? "bg-primary"
              : "bg-[repeating-linear-gradient(45deg,var(--secondary)_0_4px,transparent_4px_7px)]",
          )}
          style={{ left: `${low}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.abs(after - before)}%` }}
          transition={{ duration: reduced ? 0 : 0.9, delay: reduced ? 0 : 0.3, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
