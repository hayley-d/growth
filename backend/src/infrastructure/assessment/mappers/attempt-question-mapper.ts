import type {
  AttemptQuestion,
  AttemptQuestionChanges,
  AttemptQuestionDraft,
} from "@/domain/assessment/attempt-question";
import type { AttemptQuestion as AttemptQuestionRow } from "@/generated/prisma/client";
import { toNullableJsonInput } from "@/infrastructure/database/json-input";

export const toAttemptQuestion = (row: AttemptQuestionRow): AttemptQuestion => ({
  id: row.id,
  assessmentAttemptId: row.assessmentAttemptId,
  questionId: row.questionId,
  position: row.position,
  seed: row.seed,
  generatedQuestion: row.generatedQuestion,
  difficulty: row.difficulty,
  hintsUsed: row.hintsUsed,
});

export const toAttemptQuestionCreateData = <Draft extends AttemptQuestionDraft>(draft: Draft) => ({
  ...draft,
  generatedQuestion:
    draft.generatedQuestion === undefined
      ? undefined
      : toNullableJsonInput(draft.generatedQuestion),
});

export const toAttemptQuestionUpdateData = (changes: AttemptQuestionChanges) => ({
  ...changes,
  generatedQuestion:
    changes.generatedQuestion === undefined
      ? undefined
      : toNullableJsonInput(changes.generatedQuestion),
});
