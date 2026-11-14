import { DurationClock } from "@/components/molecules/duration-clock";
import { secondsBetween } from "@/lib/daily-challenge/format-duration";
import { useNow } from "@/lib/daily-challenge/use-now";

type LiveDurationClockProperties = {
  label: string;
  className?: string;
} & ({ since: number; until?: never } | { until: number; since?: never });

export function LiveDurationClock({ label, since, until, className }: LiveDurationClockProperties) {
  const now = useNow();
  const seconds = since === undefined ? secondsBetween(now, until) : secondsBetween(since, now);
  return <DurationClock label={label} seconds={seconds} className={className} />;
}
