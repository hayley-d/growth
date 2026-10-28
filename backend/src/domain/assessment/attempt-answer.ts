export type AttemptAnswer = {
  id: string;
  assessmentAttemptId: string;
  questionId: string;
  answerOptionId: string | null;
  seed: number | null;
  generatedQuestion: unknown | null;
  response: unknown;
  isCorrect: boolean;
  difficulty: number;
  hintsUsed: number;
  ratingBefore: number;
  ratingAfter: number;
};

export type NewAttemptAnswer = {
  assessmentAttemptId: string;
  questionId: string;
  answerOptionId?: string | null;
  seed?: number | null;
  generatedQuestion?: unknown | null;
  response: unknown;
  isCorrect: boolean;
  difficulty: number;
  hintsUsed?: number;
  ratingBefore: number;
  ratingAfter: number;
};

export type AttemptAnswerChanges = Partial<NewAttemptAnswer>;
