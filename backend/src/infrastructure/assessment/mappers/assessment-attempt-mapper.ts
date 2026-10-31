import type { AssessmentAttempt } from "@/domain/assessment/assessment-attempt";
import type { AssessmentAttempt as AssessmentAttemptRow } from "@/generated/prisma/client";

export const toAssessmentAttempt = (row: AssessmentAttemptRow): AssessmentAttempt => ({
  id: row.id,
  userId: row.userId,
  lessonId: row.lessonId,
  dailyChallengeId: row.dailyChallengeId,
  kind: row.kind,
  score: row.score,
  passed: row.passed,
  points: row.points,
  startedAt: row.startedAt,
  finishedAt: row.finishedAt,
});
