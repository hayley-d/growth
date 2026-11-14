import { toTimeTakenSeconds } from "@/domain/assessment/time-taken";

const topSize = 10;

export type DailyChallengeResult = {
  userId: string;
  displayName: string;
  showOnLeaderboard: boolean;
  passed: boolean;
  points: number;
  startedAt: Date;
  finishedAt: Date;
};

type TimedResult = DailyChallengeResult & { timeSeconds: number };

type RankedResult = TimedResult & { rank: number };

const byTimeThenPoints = (left: TimedResult, right: TimedResult) =>
  left.timeSeconds - right.timeSeconds ||
  right.points - left.points ||
  left.finishedAt.getTime() - right.finishedAt.getTime() ||
  left.userId.localeCompare(right.userId);

const assignRanks = (results: readonly TimedResult[]): RankedResult[] => {
  const ranked: RankedResult[] = [];
  for (const result of results) {
    const previous = ranked.at(-1);
    const tied =
      previous && previous.timeSeconds === result.timeSeconds && previous.points === result.points;
    ranked.push({ ...result, rank: previous && tied ? previous.rank : ranked.length + 1 });
  }
  return ranked;
};

export const rankLeaderboard = (results: readonly DailyChallengeResult[], userId: string) => {
  const timed = results.map((result) => ({
    ...result,
    timeSeconds: toTimeTakenSeconds(result.startedAt, result.finishedAt),
  }));
  const ranked = assignRanks(
    timed.filter((result) => result.passed && result.showOnLeaderboard).sort(byTimeThenPoints),
  );
  const rankByUserId = new Map(ranked.map((result) => [result.userId, result.rank]));
  const mine = timed.find((result) => result.userId === userId);

  return {
    top: ranked.slice(0, topSize).map((result) => ({
      rank: result.rank,
      displayName: result.displayName,
      timeSeconds: result.timeSeconds,
      points: result.points,
      isMe: result.userId === userId,
    })),
    me: mine
      ? {
          displayName: mine.displayName,
          rank: rankByUserId.get(mine.userId) ?? null,
          timeSeconds: mine.timeSeconds,
          points: mine.points,
          passed: mine.passed,
          hidden: !mine.showOnLeaderboard,
        }
      : null,
  };
};
