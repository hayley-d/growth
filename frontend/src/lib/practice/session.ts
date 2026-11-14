export type PracticeAnswer = {
  questionId: string;
  isCorrect: boolean;
};

export const currentStreak = (answers: readonly PracticeAnswer[]) => {
  let streak = 0;
  for (let index = answers.length - 1; index >= 0 && answers[index]?.isCorrect; index -= 1) {
    streak += 1;
  }
  return streak;
};

// Mirrors getMastery in backend/src/domain/assessment/elo-rating.ts.
const unmasteredRating = 800;
const masteredRating = 1350;

export const ratingToMastery = (rating: number) => {
  const mastery = (rating - unmasteredRating) / (masteredRating - unmasteredRating);
  return Math.round(Math.min(1, Math.max(0, mastery)) * 100);
};
