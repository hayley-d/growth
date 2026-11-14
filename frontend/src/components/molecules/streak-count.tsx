import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

type StreakCountProperties = {
  streak: number;
  className?: string;
};

const shownFrom = 2;

export function StreakCount({ streak, className }: StreakCountProperties) {
  if (streak < shownFrom) return null;
  return (
    <span className={cn("inline-flex items-center gap-1 text-sm font-medium", className)}>
      <Check aria-hidden="true" className="size-4 text-accent" strokeWidth={3} />
      {streak} in a row
    </span>
  );
}
