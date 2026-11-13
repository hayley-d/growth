import { Timer } from "lucide-react";

import {
  describeDuration,
  formatDuration,
  secondsBetween,
} from "@/lib/daily-challenge/format-duration";
import { useNow } from "@/lib/use-now";
import { cn } from "@/lib/utils";

type DurationClockProperties = {
  label: string;
  seconds: number;
  className?: string;
};

export function DurationClock({ label, seconds, className }: DurationClockProperties) {
  return (
    <p className={cn("flex items-center gap-2", className)}>
      <Timer aria-hidden className="size-4 shrink-0" />
      <span className="text-sm text-muted-foreground">{label}</span>
      <time
        dateTime={`PT${Math.max(0, Math.floor(seconds))}S`}
        className="font-mono font-semibold tabular-nums"
      >
        <span aria-hidden>{formatDuration(seconds)}</span>
        <span className="sr-only">{describeDuration(seconds)}</span>
      </time>
    </p>
  );
}

type LiveDurationClockProperties = {
  label: string;
  className?: string;
} & ({ since: number; until?: never } | { until: number; since?: never });

export function LiveDurationClock({ label, since, until, className }: LiveDurationClockProperties) {
  const now = useNow();
  const seconds = since === undefined ? secondsBetween(now, until) : secondsBetween(since, now);
  return <DurationClock label={label} seconds={seconds} className={className} />;
}
