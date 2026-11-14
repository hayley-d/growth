import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import type { DailyChallengeState } from "@shared/schemas";
import { LiveDurationClock } from "@/components/molecules/live-duration-clock";
import { cn } from "@/lib/utils";

const linkClasses =
  "mt-auto inline-flex min-h-11 w-fit items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";

type DailyChallengeCardProperties = {
  state: DailyChallengeState | null;
  className?: string;
};

const challengeLink = (label: string) => (
  <Link to="/daily" className={linkClasses}>
    {label}
    <ArrowRight aria-hidden className="size-4" />
  </Link>
);

export function DailyChallengeCard({ state, className }: DailyChallengeCardProperties) {
  const cardClasses = cn("flex flex-1 flex-col gap-3", className);

  if (!state) {
    return (
      <div className={cardClasses}>
        <p className="text-sm text-muted-foreground">We couldn't load today's challenge here.</p>
        {challengeLink("Open the daily challenge")}
      </div>
    );
  }

  if (state.status === "not_started") {
    return (
      <div className={cardClasses}>
        <p>One question, the same for everyone. The clock starts when you press Start.</p>
        {challengeLink("Take today's challenge")}
      </div>
    );
  }

  return (
    <div className={cardClasses}>
      <p>You've started today's challenge and the clock is running.</p>
      {state.startedAt ? (
        <LiveDurationClock label="Time so far" since={Date.parse(state.startedAt)} />
      ) : null}
      {challengeLink("Finish today's challenge")}
    </div>
  );
}
