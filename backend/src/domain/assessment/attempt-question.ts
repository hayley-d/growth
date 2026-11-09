export type AttemptQuestion = {
  id: string;
  assessmentAttemptId: string;
  questionId: string;
  position: number;
  seed: number | null;
  generatedQuestion: unknown | null;
  difficulty: number;
  hintsUsed: number;
};

export type NewAttemptQuestion = {
  assessmentAttemptId: string;
  questionId: string;
  position: number;
  seed?: number | null;
  generatedQuestion?: unknown | null;
  difficulty: number;
  hintsUsed?: number;
};

export type AttemptQuestionDraft = Omit<NewAttemptQuestion, "assessmentAttemptId">;

export type AttemptQuestionChanges = Partial<NewAttemptQuestion>;
