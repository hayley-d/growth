import type { NewQuestion, Question, QuestionChanges } from "@/domain/assessment/question";
import type { Question as QuestionRow } from "@/generated/prisma/client";
import { toNullableJsonInput } from "@/infrastructure/database/json-input";

export const toQuestion = (row: QuestionRow): Question => ({
  id: row.id,
  lessonId: row.lessonId,
  reviewLessonId: row.reviewLessonId,
  type: row.type,
  difficulty: row.difficulty,
  bloomsLevel: row.bloomsLevel,
  prompt: row.prompt,
  generatorKey: row.generatorKey,
  generatorOptions: row.generatorOptions,
  explanation: row.explanation,
});

export const toQuestionCreateData = (question: NewQuestion) => ({
  ...question,
  generatorOptions:
    question.generatorOptions === undefined
      ? undefined
      : toNullableJsonInput(question.generatorOptions),
});

export const toQuestionUpdateData = (changes: QuestionChanges) => ({
  ...changes,
  generatorOptions:
    changes.generatorOptions === undefined
      ? undefined
      : toNullableJsonInput(changes.generatorOptions),
});
