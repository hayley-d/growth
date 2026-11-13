export type AttemptKind = "lesson_test" | "checkpoint" | "daily_challenge" | "practice";

export type PracticeTopic = "traversals" | "insertion" | "deletion" | "rotations" | "mixed";

export type AssessmentAttempt = {
  id: string;
  userId: string;
  lessonId: string | null;
  dailyChallengeId: string | null;
  kind: AttemptKind;
  practiceTopic: PracticeTopic | null;
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
  practiceTopic?: PracticeTopic | null;
  score?: number;
  passed?: boolean;
  points?: number;
  startedAt?: Date;
  finishedAt?: Date | null;
};

export type AssessmentAttemptChanges = Partial<NewAssessmentAttempt>;
