import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, Star, X } from "lucide-react";

import type { DailyChallengeState } from "@shared/schemas";
import { DurationClock } from "@/components/molecules/duration-clock";
import { LiveDurationClock } from "@/components/molecules/live-duration-clock";
import { cn } from "@/lib/utils";

const linkClasses =
  "inline-flex min-h-11 w-fit items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";

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
  const cardClasses = cn("flex flex-col gap-3 rounded-lg border p-4 sm:p-6", className);

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

  if (state.status === "in_progress" || !state.result) {
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

  const { result } = state;
  const Icon = result.isCorrect ? Check : X;

  return (
    <div className={cardClasses}>
      <p className="flex items-center gap-2 font-semibold">
        <span
          className={cn(
            "grid size-7 place-items-center rounded-full border-2",
            result.isCorrect
              ? "border-primary text-primary"
              : "border-destructive text-destructive",
          )}
        >
          <Icon aria-hidden className="size-4" />
        </span>
        {result.isCorrect ? "You got today's challenge right" : "Not quite today"}
      </p>
      <div className="flex flex-wrap gap-x-8 gap-y-2">
        <p className="flex items-center gap-2">
          <Star aria-hidden className="size-4 shrink-0" />
          <span className="text-sm text-muted-foreground">Points</span>
          <span className="font-semibold tabular-nums">{result.points}</span>
        </p>
        <DurationClock label="Your time" seconds={result.timeTakenSeconds} />
      </div>
      <LiveDurationClock label="Next challenge in" until={Date.parse(state.nextChallengeAt)} />
    </div>
  );
}
