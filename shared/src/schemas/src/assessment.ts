import { z } from "zod";

import {
  traversalOrderSchema,
  treeKeySchema,
  treeKeysSchema,
} from "@shared/schemas/src/content-block";
import { treeModeSchema } from "@shared/schemas/src/lesson";

export const questionTypeSchema = z.enum([
  "multiple_choice",
  "build_tree",
  "order_nodes",
  "predict_rotation",
  "text",
]);

export type QuestionType = z.infer<typeof questionTypeSchema>;

export const bloomsLevelSchema = z.enum([
  "remember",
  "understand",
  "apply",
  "analyse",
  "evaluate",
  "create",
]);

export type BloomsLevel = z.infer<typeof bloomsLevelSchema>;

export const attemptKindSchema = z.enum([
  "lesson_test",
  "checkpoint",
  "daily_challenge",
  "practice",
]);

export type AttemptKind = z.infer<typeof attemptKindSchema>;

export const generatorKeySchema = z.enum([
  "traversal-order",
  "insert-result",
  "delete-result",
  "predict-rotation",
  "balance-factor",
  "height",
  "is-avl",
]);

export type GeneratorKey = z.infer<typeof generatorKeySchema>;

export const generatorOptionsSchema = z.object({
  order: traversalOrderSchema.optional(),
  shape: treeModeSchema.optional(),
});

export type GeneratorOptions = z.infer<typeof generatorOptionsSchema>;

export const rotationSchema = z.enum(["left", "right", "leftRight", "rightLeft", "none"]);

export type Rotation = z.infer<typeof rotationSchema>;

export const learnerAnswerSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("multiple_choice"), optionId: z.uuid() }),
  z.object({ type: z.literal("build_tree"), tree: z.string() }),
  z.object({ type: z.literal("order_nodes"), keys: treeKeysSchema }),
  z.object({
    type: z.literal("predict_rotation"),
    rotation: rotationSchema,
    pivotKey: treeKeySchema.nullable(),
  }),
  z.object({ type: z.literal("text"), text: z.string().trim().min(1).max(200) }),
]);

export type LearnerAnswer = z.infer<typeof learnerAnswerSchema>;

export const replaySchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("operation"),
    operation: z.enum(["insert", "delete"]),
    key: treeKeySchema,
  }),
  z.object({ kind: z.literal("traversal"), order: traversalOrderSchema }),
]);

export type Replay = z.infer<typeof replaySchema>;

export const generatedQuestionSchema = z
  .object({
    type: questionTypeSchema,
    prompt: z.string(),
    tree: z.string().nullable(),
    options: z.array(z.object({ id: z.uuid(), text: z.string() })).optional(),
    answer: learnerAnswerSchema,
    explanation: z.string(),
    hints: z.array(z.string()).min(2),
    replay: replaySchema.nullable().optional(),
  })
  .refine(
    (value) => value.answer.type === value.type,
    "The answer type must match the question type",
  );

export type GeneratedQuestion = z.infer<typeof generatedQuestionSchema>;
