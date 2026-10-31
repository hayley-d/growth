export type AttemptKind = "lesson_test" | "checkpoint" | "daily_challenge" | "practice";

export type AssessmentAttempt = {
  id: string;
  userId: string;
  lessonId: string | null;
  dailyChallengeId: string | null;
  kind: AttemptKind;
  score: number;
  passed: boolean;
  points: number;
  startedAt: Date;
  finishedAt: Date | null;
};

export type NewAssessmentAttempt = {
  userId: string;
  lessonId?: string | null;
  dailyChallengeId?: string | null;
  kind: AttemptKind;
  score?: number;
  passed?: boolean;
  points?: number;
  startedAt?: Date;
  finishedAt?: Date | null;
};

export type AssessmentAttemptChanges = Partial<NewAssessmentAttempt>;
