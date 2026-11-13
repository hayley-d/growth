import { z } from "zod";

import { learnerAnswerSchema, replaySchema } from "@shared/schemas/src/assessment";
import { attemptQuestionSchema } from "@shared/schemas/src/attempt";

export const dailyChallengeStatusSchema = z.enum(["not_started", "in_progress", "finished"]);

export type DailyChallengeStatus = z.infer<typeof dailyChallengeStatusSchema>;

export const dailyChallengeResultSchema = z.object({
  prompt: z.string(),
  tree: z.string().nullable(),
  response: learnerAnswerSchema,
  isCorrect: z.boolean(),
  correctAnswer: learnerAnswerSchema,
  explanation: z.string(),
  replay: replaySchema.nullable(),
  points: z.int().nonnegative(),
  timeTakenSeconds: z.int().nonnegative(),
});

export type DailyChallengeResult = z.infer<typeof dailyChallengeResultSchema>;

export const dailyChallengeStateSchema = z.object({
  date: z.iso.date(),
  nextChallengeAt: z.iso.datetime(),
  status: dailyChallengeStatusSchema,
  startedAt: z.iso.datetime().nullable(),
  finishedAt: z.iso.datetime().nullable(),
  question: attemptQuestionSchema.strict().nullable(),
  result: dailyChallengeResultSchema.nullable(),
});

export type DailyChallengeState = z.infer<typeof dailyChallengeStateSchema>;

export const dailyChallengeStateResponseSchema = z.object({
  data: dailyChallengeStateSchema,
});

export type DailyChallengeStateResponse = z.infer<typeof dailyChallengeStateResponseSchema>;
