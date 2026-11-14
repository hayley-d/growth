import type { LeaderboardResponse } from "@shared/schemas";
import { YouBadge } from "@/components/molecules/you-badge";
import { describeDuration, formatDuration } from "@/lib/daily-challenge/format-duration";
import { cn } from "@/lib/utils";

type LeaderboardCardProperties = {
  data: LeaderboardResponse["data"] | null;
  className?: string;
};

type BoardRow = {
  rank: number;
  displayName: string;
  timeSeconds: number;
  points: number;
};

function Duration({ seconds }: { seconds: number }) {
  return (
    <time
      dateTime={`PT${Math.max(0, Math.floor(seconds))}S`}
      className="font-mono font-semibold tabular-nums"
    >
      <span aria-hidden>{formatDuration(seconds)}</span>
      <span className="sr-only">{describeDuration(seconds)}</span>
    </time>
  );
}

function BoardCells({ row, isMe }: { row: BoardRow; isMe: boolean }) {
  return (
    <>
      <td className="py-2 pr-4 font-mono tabular-nums">{row.rank}</td>
      <td className="py-2 pr-4">
        <span className="inline-flex items-center gap-2">
          {row.displayName}
          {isMe ? <YouBadge /> : null}
        </span>
      </td>
      <td className="py-2 pr-4 text-right">
        <Duration seconds={row.timeSeconds} />
      </td>
      <td className="py-2 text-right font-semibold tabular-nums">{row.points}</td>
    </>
  );
}

const headerClasses = "sticky top-0 bg-card py-2 pr-4 font-medium";

export function LeaderboardCard({ data, className }: LeaderboardCardProperties) {
  if (!data) {
    return (
      <p className={cn("text-sm text-muted-foreground", className)}>
        We couldn't load the leaderboard here.
      </p>
    );
  }

  const { top, me } = data;
  const keyCounts = new Map<string, number>();
  const keyedTop = top.map((entry) => {
    const base = `${entry.rank}-${entry.displayName}-${entry.timeSeconds}-${entry.points}`;
    const count = (keyCounts.get(base) ?? 0) + 1;
    keyCounts.set(base, count);
    return { entry, key: `${base}-${count}` };
  });
  const pinnedRow = me && me.rank !== null && !top.some((entry) => entry.isMe) ? me : null;

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {me === null ? <p>Finish today's challenge to get on the board.</p> : null}
      {me && !me.passed ? <p>You didn't pass today's challenge. Come back tomorrow.</p> : null}
      {me?.passed && me.hidden ? (
        <p>You finished in {describeDuration(me.timeSeconds)}. You're hidden from the board.</p>
      ) : null}
      {top.length === 0 && me === null ? (
        <p className="text-sm text-muted-foreground">Nobody has finished today's challenge yet.</p>
      ) : null}
      {top.length > 0 ? (
        <section
          aria-label="Today's rankings"
          className="max-h-72 overflow-y-auto rounded-md border [scrollbar-color:var(--muted-foreground)_transparent] [scrollbar-width:thin]"
        >
          <table className="w-full text-sm">
            <caption className="sr-only">Today's leaderboard</caption>
            <thead className="text-left text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              <tr>
                <th scope="col" className={cn(headerClasses, "pl-3")}>
                  Rank
                </th>
                <th scope="col" className={headerClasses}>
                  Name
                </th>
                <th scope="col" className={cn(headerClasses, "text-right")}>
                  Time
                </th>
                <th scope="col" className={cn(headerClasses, "pr-3 text-right")}>
                  Points
                </th>
              </tr>
            </thead>
            <tbody>
              {keyedTop.map(({ entry, key }) => (
                <tr
                  key={key}
                  className={cn(
                    "border-b border-dashed last:border-b-0 [&>td:first-child]:pl-3 [&>td:last-child]:pr-3",
                    entry.isMe && "bg-accent/40",
                  )}
                >
                  <BoardCells row={entry} isMe={entry.isMe} />
                </tr>
              ))}
            </tbody>
            {pinnedRow ? (
              <tfoot>
                <tr className="[&>td:first-child]:pl-3 [&>td:last-child]:pr-3 [&>td]:sticky [&>td]:bottom-0 [&>td]:border-t [&>td]:bg-card">
                  <BoardCells
                    row={{
                      rank: pinnedRow.rank ?? 0,
                      displayName: pinnedRow.displayName,
                      timeSeconds: pinnedRow.timeSeconds,
                      points: pinnedRow.points,
                    }}
                    isMe
                  />
                </tr>
              </tfoot>
            ) : null}
          </table>
        </section>
      ) : null}
    </div>
  );
}
