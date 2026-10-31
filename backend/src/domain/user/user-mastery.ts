export type UserMasteryKey = {
  userId: string;
  lessonId: string;
};

export type UserMastery = {
  userId: string;
  lessonId: string;
  rating: number;
  mastery: number;
  currentDifficulty: number;
  updatedAt: Date;
};

export type NewUserMastery = {
  userId: string;
  lessonId: string;
  rating?: number;
  mastery?: number;
  currentDifficulty?: number;
};

export type UserMasteryChanges = Partial<Omit<NewUserMastery, "userId" | "lessonId">>;
