import { z } from "zod";

import { learnerAnswerSchema, questionTypeSchema } from "@shared/schemas/src/assessment";

export const testAttemptKindSchema = z.enum(["lesson_test", "checkpoint"]);

export type TestAttemptKind = z.infer<typeof testAttemptKindSchema>;

export const attemptStatusSchema = z.enum(["in_progress", "finished"]);

export type AttemptStatus = z.infer<typeof attemptStatusSchema>;

export const attemptSchema = z.object({
  id: z.uuid(),
  lessonId: z.uuid(),
  kind: testAttemptKindSchema,
  status: attemptStatusSchema,
  total: z.int().positive(),
  answeredCount: z.int().nonnegative(),
  startedAt: z.iso.datetime(),
  finishedAt: z.iso.datetime().nullable(),
});

export type Attempt = z.infer<typeof attemptSchema>;

export const attemptQuestionSchema = z.object({
  id: z.uuid(),
  position: z.int().positive(),
  type: questionTypeSchema,
  prompt: z.string(),
  tree: z.string().nullable(),
  options: z.array(z.object({ id: z.uuid(), text: z.string() })).optional(),
  difficulty: z.int().min(1).max(5),
  hints: z.array(z.string()),
  hintsTotal: z.int().nonnegative(),
  hintsRemaining: z.int().nonnegative(),
});

export type AttemptQuestion = z.infer<typeof attemptQuestionSchema>;

export const attemptReviewLessonSchema = z.object({
  id: z.uuid(),
  title: z.string(),
});

export const attemptReviewAnswerSchema = z.object({
  questionId: z.uuid(),
  position: z.int().positive(),
  prompt: z.string(),
  tree: z.string().nullable(),
  response: learnerAnswerSchema,
  isCorrect: z.boolean(),
  correctAnswer: learnerAnswerSchema,
  explanation: z.string(),
  hintsUsed: z.int().nonnegative(),
  points: z.int().nonnegative(),
});

export const attemptResultSchema = z.object({
  score: z.int().min(0).max(100),
  passed: z.boolean(),
  points: z.int().nonnegative(),
  ratingChange: z.int(),
  reviewLessons: z.array(attemptReviewLessonSchema),
  answers: z.array(attemptReviewAnswerSchema),
});

export type AttemptResult = z.infer<typeof attemptResultSchema>;

export const attemptStateResponseSchema = z.object({
  data: z.object({
    attempt: attemptSchema,
    question: attemptQuestionSchema.nullable(),
    result: attemptResultSchema.nullable(),
  }),
});

export type AttemptStateResponse = z.infer<typeof attemptStateResponseSchema>;

export const requestHintRequestSchema = z.object({
  questionId: z.uuid(),
});

export type RequestHintRequest = z.infer<typeof requestHintRequestSchema>;

export const requestHintResponseSchema = z.object({
  data: z.object({
    questionId: z.uuid(),
    hint: z.string(),
    hintNumber: z.int().positive(),
    hintsRemaining: z.int().nonnegative(),
  }),
});

export type RequestHintResponse = z.infer<typeof requestHintResponseSchema>;

export const submitAnswerRequestSchema = z.object({
  questionId: z.uuid(),
  answer: learnerAnswerSchema,
});

export type SubmitAnswerRequest = z.infer<typeof submitAnswerRequestSchema>;

export const submitAnswerResponseSchema = z.object({
  data: z.object({
    isCorrect: z.boolean(),
    correctAnswer: learnerAnswerSchema,
    explanation: z.string(),
    hintsUsed: z.int().nonnegative(),
    points: z.int().nonnegative(),
    rating: z.object({ before: z.int(), after: z.int() }),
    attempt: attemptSchema,
    question: attemptQuestionSchema.nullable(),
    result: attemptResultSchema.nullable(),
  }),
});

export type SubmitAnswerResponse = z.infer<typeof submitAnswerResponseSchema>;
