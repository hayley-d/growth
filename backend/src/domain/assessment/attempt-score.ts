export const attemptLength = 5;

export const passMark = 80;

export const getAttemptScore = (correctCount: number, total: number): number =>
  total === 0 ? 0 : Math.round((correctCount / total) * 100);

export const isPassed = (score: number): boolean => score >= passMark;
