import { z } from "zod";

export const practiceTopicSchema = z.enum([
  "traversals",
  "insertion",
  "deletion",
  "rotations",
  "mixed",
]);

export type PracticeTopic = z.infer<typeof practiceTopicSchema>;

export const startPracticeRequestSchema = z.object({
  topic: practiceTopicSchema,
});

export type StartPracticeRequest = z.infer<typeof startPracticeRequestSchema>;

export const practiceLessonSummarySchema = z.object({
  lessonId: z.uuid(),
  title: z.string(),
  ratingBefore: z.int(),
  ratingAfter: z.int(),
});

export type PracticeLessonSummary = z.infer<typeof practiceLessonSummarySchema>;

export const practiceSummarySchema = z.object({
  answered: z.int().nonnegative(),
  correct: z.int().nonnegative(),
  ratingChange: z.int(),
  lessons: z.array(practiceLessonSummarySchema),
});

export type PracticeSummary = z.infer<typeof practiceSummarySchema>;

export const practiceSummaryResponseSchema = z.object({
  data: practiceSummarySchema,
});

export type PracticeSummaryResponse = z.infer<typeof practiceSummaryResponseSchema>;

export const practiceTopicsResponseSchema = z.object({
  data: z.array(z.object({ topic: practiceTopicSchema, available: z.boolean() })),
});

export type PracticeTopicsResponse = z.infer<typeof practiceTopicsResponseSchema>;
