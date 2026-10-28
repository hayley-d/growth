export type DailyChallenge = {
  id: string;
  date: Date;
  questionId: string;
  seed: number;
};

export type NewDailyChallenge = {
  date: Date;
  questionId: string;
  seed: number;
};

export type DailyChallengeChanges = Partial<NewDailyChallenge>;
