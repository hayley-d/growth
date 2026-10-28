import type { AnswerOption } from "@/domain/assessment/answer-option";
import type { AnswerOption as AnswerOptionRow } from "@/generated/prisma/client";

export const toAnswerOption = (row: AnswerOptionRow): AnswerOption => ({
  id: row.id,
  questionId: row.questionId,
  text: row.text,
  isCorrect: row.isCorrect,
});
