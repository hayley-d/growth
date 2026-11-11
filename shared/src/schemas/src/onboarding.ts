import { z } from "zod";

import { learningStyleSchema } from "@shared/schemas/src/course-content";

const quizIdSchema = z.string().min(1).max(64);

const quizOptionSchema = z.object({
  id: quizIdSchema,
  text: z.string(),
});

export const quizQuestionSchema = z.object({
  id: quizIdSchema,
  prompt: z.string(),
  options: z.array(quizOptionSchema).length(4),
});

export type QuizQuestion = z.infer<typeof quizQuestionSchema>;

export const getQuizResponseSchema = z.object({
  data: z.object({
    questions: z.array(quizQuestionSchema),
  }),
});

export type GetQuizResponse = z.infer<typeof getQuizResponseSchema>;

export const toGetQuizResponse = (
  questions: z.input<typeof quizQuestionSchema>[],
): GetQuizResponse => getQuizResponseSchema.parse({ data: { questions } });

export const quizAnswerSchema = z.object({
  questionId: quizIdSchema,
  optionId: quizIdSchema,
});

export type QuizAnswer = z.infer<typeof quizAnswerSchema>;

export const scoreQuizRequestSchema = z.object({
  answers: z.array(quizAnswerSchema).min(1).max(32),
});

export type ScoreQuizRequest = z.infer<typeof scoreQuizRequestSchema>;

export const scoreQuizResponseSchema = z.object({
  data: z.object({
    learningStyle: learningStyleSchema,
  }),
});

export type ScoreQuizResponse = z.infer<typeof scoreQuizResponseSchema>;

export const toScoreQuizResponse = (
  learningStyle: z.input<typeof learningStyleSchema>,
): ScoreQuizResponse => scoreQuizResponseSchema.parse({ data: { learningStyle } });
