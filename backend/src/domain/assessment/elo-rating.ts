export const difficulties = [1, 2, 3, 4, 5] as const;

export const startingRating = 1000;

const easiestQuestionRating = 800;
const ratingPerDifficulty = 100;
const startingRatingStep = 96;
const settledRatingStep = 32;
const ratingStepDecay = 0.1;
const targetExpectedScore = 0.7;
const unmasteredRating = 800;
const masteredRating = 1350;
const pointsPerDifficulty = 100;

export function getQuestionRating(difficulty: number): number {
  return easiestQuestionRating + (difficulty - 1) * ratingPerDifficulty;
}

export function getExpectedScore(learnerRating: number, questionRating: number): number {
  return 1 / (1 + 10 ** ((questionRating - learnerRating) / 400));
}

export function getScore(isCorrect: boolean, hintsUsed: number): number {
  if (!isCorrect) {
    return 0;
  }
  if (hintsUsed === 0) {
    return 1;
  }
  return hintsUsed === 1 ? 0.75 : 0.5;
}

export function getRatingStep(answerCount: number): number {
  return Math.max(settledRatingStep, startingRatingStep / (1 + ratingStepDecay * answerCount));
}

export function getNextRating(
  learnerRating: number,
  difficulty: number,
  score: number,
  answerCount: number,
): number {
  const expectedScore = getExpectedScore(learnerRating, getQuestionRating(difficulty));
  return Math.round(learnerRating + getRatingStep(answerCount) * (score - expectedScore));
}

export function getNextDifficulty(learnerRating: number): number {
  const distance = (difficulty: number) =>
    Math.abs(getExpectedScore(learnerRating, getQuestionRating(difficulty)) - targetExpectedScore);
  return difficulties.reduce((best, difficulty) =>
    distance(difficulty) < distance(best) ? difficulty : best,
  );
}

export function getMastery(learnerRating: number): number {
  const mastery = (learnerRating - unmasteredRating) / (masteredRating - unmasteredRating);
  return Math.round(Math.min(1, Math.max(0, mastery)) * 10000) / 10000;
}

export function getPoints(difficulty: number, score: number): number {
  return Math.round(difficulty * pointsPerDifficulty * score);
}
