const millisecondsPerSecond = 1000;

export const toTimeTakenSeconds = (startedAt: Date, finishedAt: Date): number =>
  Math.max(0, Math.round((finishedAt.getTime() - startedAt.getTime()) / millisecondsPerSecond));
