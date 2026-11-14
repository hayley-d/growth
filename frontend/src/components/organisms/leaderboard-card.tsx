import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import type { LeaderboardResponse } from "@shared/schemas";
import { DurationClock } from "@/components/molecules/duration-clock";
import { describeDuration } from "@/lib/daily-challenge/format-duration";
import { cn } from "@/lib/utils";

const linkClasses =
  "inline-flex min-h-11 w-fit items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";

type LeaderboardCardProperties = {
  data: LeaderboardResponse["data"] | null;
  className?: string;
};

const boardLink = (to: "/daily" | "/leaderboard", label: string) => (
  <Link to={to} className={linkClasses}>
    {label}
    <ArrowRight aria-hidden className="size-4" />
  </Link>
);

function YouBadge() {
  return (
    <span className="inline-flex items-center rounded-full border border-foreground bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">
      You
    </span>
  );
}

export function LeaderboardCard({ data, className }: LeaderboardCardProperties) {
  const cardClasses = cn("flex flex-col gap-3 rounded-lg border p-4 sm:p-6", className);

  if (!data) {
    return (
      <div className={cardClasses}>
        <p className="text-sm text-muted-foreground">We couldn't load the leaderboard here.</p>
        {boardLink("/leaderboard", "Open the leaderboard")}
      </div>
    );
  }

  if (data.me === null) {
    return (
      <div className={cardClasses}>
        <p>Finish today's challenge to get on the board.</p>
        {boardLink("/daily", "Take today's challenge")}
      </div>
    );
  }

  if (data.me.hidden) {
    return (
      <div className={cardClasses}>
        <p>
          You finished in {describeDuration(data.me.timeSeconds)}. You're hidden from the board.
        </p>
        {boardLink("/leaderboard", "View the leaderboard")}
      </div>
    );
  }

  return (
    <div className={cardClasses}>
      {data.me.rank !== null ? <p className="font-semibold">You're #{data.me.rank} today</p> : null}
      <DurationClock label="Your time" seconds={data.me.timeSeconds} />
      <ol className="flex flex-col gap-1">
        {data.top.slice(0, 3).map((entry) => (
          <li
            key={`${entry.rank}-${entry.displayName}-${entry.timeSeconds}`}
            className="flex items-center gap-2 text-sm"
          >
            <span className="w-5 font-mono tabular-nums">{entry.rank}</span>
            <span className="inline-flex items-center gap-2">
              {entry.displayName}
              {entry.isMe ? <YouBadge /> : null}
            </span>
          </li>
        ))}
      </ol>
      {boardLink("/leaderboard", "View the leaderboard")}
    </div>
  );
}
