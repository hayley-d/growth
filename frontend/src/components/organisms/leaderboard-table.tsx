import { createColumnHelper, tableFeatures, useTable } from "@tanstack/react-table";

import type { LeaderboardEntry, LeaderboardMe } from "@shared/schemas";
import { describeDuration, formatDuration } from "@/lib/daily-challenge/format-duration";
import { cn } from "@/lib/utils";

type LeaderboardTableProperties = {
  entries: LeaderboardEntry[];
  me: LeaderboardMe | null;
};

const features = tableFeatures({});
const helper = createColumnHelper<typeof features, LeaderboardEntry>();
const columns = helper.columns([
  helper.accessor("rank", { header: "Rank" }),
  helper.accessor("displayName", {
    header: "Name",
    cell: (info) => (
      <span className="inline-flex items-center gap-2">
        {info.getValue()}
        {info.row.original.isMe ? <YouBadge /> : null}
      </span>
    ),
  }),
  helper.accessor("timeSeconds", {
    header: "Time",
    cell: (info) => <DurationTime seconds={info.getValue()} />,
  }),
]);
const fallbackEntries: LeaderboardEntry[] = [];

const hiddenRank = "–";

function YouBadge() {
  return (
    <span className="inline-flex items-center rounded-full border border-foreground bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">
      You
    </span>
  );
}

function DurationTime({ seconds }: { seconds: number }) {
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

export function LeaderboardTable({ entries, me }: LeaderboardTableProperties) {
  const table = useTable({ features, columns, data: entries ?? fallbackEntries });
  const showPinnedRow = me !== null && !entries.some((entry) => entry.isMe);

  return (
    <table className="w-full text-sm">
      <caption className="sr-only">Today's leaderboard</caption>
      <thead className="text-left text-xs font-semibold tracking-widest text-muted-foreground uppercase">
        {table.getHeaderGroups().map((group) => (
          <tr key={group.id}>
            {group.headers.map((header) => (
              <th
                key={header.id}
                scope="col"
                className={cn(
                  "py-2 pr-4 font-medium",
                  header.column.id === "timeSeconds" && "text-right",
                )}
              >
                {header.isPlaceholder ? null : <table.FlexRender header={header} />}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr
            key={row.id}
            className={cn(
              "border-b border-dashed last:border-b-0",
              row.original.isMe && "bg-accent/40",
            )}
          >
            {row.getAllCells().map((cell) => (
              <td
                key={cell.id}
                className={cn("py-2 pr-4", cell.column.id === "timeSeconds" && "text-right")}
              >
                <table.FlexRender cell={cell} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
      {showPinnedRow && me ? (
        <tfoot>
          <tr className="border-t bg-accent/40">
            <td className="py-2 pr-4">{me.hidden ? hiddenRank : me.rank}</td>
            <td className="py-2 pr-4">
              <span className="inline-flex items-center gap-2">
                {me.displayName}
                <YouBadge />
              </span>
            </td>
            <td className="py-2 pr-4 text-right">
              <DurationTime seconds={me.timeSeconds} />
            </td>
          </tr>
          {me.hidden ? (
            <tr>
              <td colSpan={3} className="py-2 text-sm text-muted-foreground">
                Only you can see this. You're hidden from the board.
              </td>
            </tr>
          ) : null}
        </tfoot>
      ) : null}
    </table>
  );
}
