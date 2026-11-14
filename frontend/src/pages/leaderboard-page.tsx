import { Link } from "@tanstack/react-router";

import { EmptyState } from "@/components/molecules/empty-state";
import { PageLoader } from "@/components/molecules/page-loader";
import { LeaderboardTable } from "@/components/organisms/leaderboard-table";
import { useLeaderboardQuery } from "@/lib/queries";

const linkClasses =
  "inline-flex min-h-11 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";

export function LeaderboardPage() {
  const leaderboard = useLeaderboardQuery();

  if (leaderboard.isPending) return <PageLoader />;

  if (leaderboard.isError) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <h1 className="text-2xl font-semibold sm:text-3xl">Leaderboard</h1>
        <p role="alert" className="max-w-sm text-muted-foreground">
          {leaderboard.error.message}
        </p>
        <button
          type="button"
          onClick={() => leaderboard.refetch()}
          className="mt-2 inline-flex min-h-11 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          Try again
        </button>
      </div>
    );
  }

  const { top, me } = leaderboard.data.data;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold sm:text-3xl">Leaderboard</h1>
        <p className="mt-1 text-muted-foreground">
          Today's daily challenge, ranked by time since 00:00 South African time.
        </p>
      </div>
      {top.length === 0 && me === null ? (
        <EmptyState
          title="Nobody has finished today's challenge yet"
          description="Be the first to finish it."
          action={
            <Link to="/daily" className={linkClasses}>
              Take today's challenge
            </Link>
          }
        />
      ) : (
        <>
          {me === null ? (
            <Link
              to="/daily"
              className="inline-flex min-h-11 w-fit items-center text-sm font-medium underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              Take today's challenge to get on the board
            </Link>
          ) : null}
          <LeaderboardTable entries={top} me={me} />
        </>
      )}
    </div>
  );
}
