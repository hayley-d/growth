const millisecondsPerSecond = 1000;
const topSize = 10;

export type DailyChallengeResult = {
  userId: string;
  displayName: string;
  showOnLeaderboard: boolean;
  finishedAt: Date;
};

type TimedResult = DailyChallengeResult & { timeSeconds: number };

type RankedResult = TimedResult & { rank: number };

const wholeSecondsAfter = (dayStart: Date, finishedAt: Date) =>
  Math.floor((finishedAt.getTime() - dayStart.getTime()) / millisecondsPerSecond);

const fastestPerLearner = (results: readonly DailyChallengeResult[]) => {
  const fastest = new Map<string, DailyChallengeResult>();
  for (const result of results) {
    const current = fastest.get(result.userId);
    if (!current || result.finishedAt.getTime() < current.finishedAt.getTime()) {
      fastest.set(result.userId, result);
    }
  }
  return [...fastest.values()];
};

const byTime = (left: TimedResult, right: TimedResult) =>
  left.timeSeconds - right.timeSeconds ||
  left.finishedAt.getTime() - right.finishedAt.getTime() ||
  left.userId.localeCompare(right.userId);

const assignRanks = (results: readonly TimedResult[]): RankedResult[] => {
  const ranked: RankedResult[] = [];
  for (const result of results) {
    const previous = ranked.at(-1);
    const rank =
      previous && previous.timeSeconds === result.timeSeconds ? previous.rank : ranked.length + 1;
    ranked.push({ ...result, rank });
  }
  return ranked;
};

export const rankLeaderboard = (
  results: readonly DailyChallengeResult[],
  userId: string,
  dayStart: Date,
) => {
  const fastest = fastestPerLearner(results).map((result) => ({
    ...result,
    timeSeconds: wholeSecondsAfter(dayStart, result.finishedAt),
  }));
  const ranked = assignRanks(fastest.filter((result) => result.showOnLeaderboard).sort(byTime));
  const rankByUserId = new Map(ranked.map((result) => [result.userId, result.rank]));
  const mine = fastest.find((result) => result.userId === userId);

  return {
    top: ranked.slice(0, topSize).map(({ rank, displayName, timeSeconds }) => ({
      rank,
      displayName,
      timeSeconds,
    })),
    me: mine
      ? {
          displayName: mine.displayName,
          rank: mine.showOnLeaderboard ? (rankByUserId.get(mine.userId) ?? null) : null,
          timeSeconds: mine.timeSeconds,
          hidden: !mine.showOnLeaderboard,
        }
      : null,
  };
};
