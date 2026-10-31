import type {
  AttemptAnswer,
  AttemptAnswerChanges,
  NewAttemptAnswer,
} from "@/domain/assessment/attempt-answer";
import type { AttemptAnswer as AttemptAnswerRow } from "@/generated/prisma/client";
import { toJsonInput, toNullableJsonInput } from "@/infrastructure/database/json-input";

export const toAttemptAnswer = (row: AttemptAnswerRow): AttemptAnswer => ({
  id: row.id,
  assessmentAttemptId: row.assessmentAttemptId,
  questionId: row.questionId,
  answerOptionId: row.answerOptionId,
  seed: row.seed,
  generatedQuestion: row.generatedQuestion,
  response: row.response,
  isCorrect: row.isCorrect,
  difficulty: row.difficulty,
  hintsUsed: row.hintsUsed,
  ratingBefore: row.ratingBefore,
  ratingAfter: row.ratingAfter,
});

export const toAttemptAnswerCreateData = (attemptAnswer: NewAttemptAnswer) => ({
  ...attemptAnswer,
  generatedQuestion:
    attemptAnswer.generatedQuestion === undefined
      ? undefined
      : toNullableJsonInput(attemptAnswer.generatedQuestion),
  response: toJsonInput(attemptAnswer.response),
});

export const toAttemptAnswerUpdateData = (changes: AttemptAnswerChanges) => ({
  ...changes,
  generatedQuestion:
    changes.generatedQuestion === undefined
      ? undefined
      : toNullableJsonInput(changes.generatedQuestion),
  response: changes.response === undefined ? undefined : toJsonInput(changes.response),
});
