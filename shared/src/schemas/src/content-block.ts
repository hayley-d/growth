import { z } from "zod";

import type { NodeState, TraversalOrder, TreeGoal } from "@shared/avl";

export const treeKeySchema = z.number().int();

export type TreeKey = z.infer<typeof treeKeySchema>;

export const treeKeysSchema = z
  .array(treeKeySchema)
  .refine((keys) => new Set(keys).size === keys.length, "Keys must not repeat");

export type TreeKeys = z.infer<typeof treeKeysSchema>;

export const nodeStateSchema = z.enum([
  "active",
  "visited",
  "deleting",
  "unbalanced",
  "new",
]) satisfies z.ZodType<NodeState>;

export const traversalOrderSchema = z.enum([
  "preorder",
  "inorder",
  "postorder",
  "levelorder",
]) satisfies z.ZodType<TraversalOrder>;

export const treeOperationSchema = z.enum([
  "insert",
  "delete",
  "search",
  "rotateLeft",
  "rotateRight",
  "traverse",
]);

export type TreeOperation = z.infer<typeof treeOperationSchema>;

export const operationStepSchema = z.object({
  operation: z.enum(["insert", "delete", "search"]),
  key: treeKeySchema,
});

export type OperationStep = z.infer<typeof operationStepSchema>;

export const playgroundGoalSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("containsKeys"), keys: treeKeysSchema }),
  z.object({ kind: z.literal("validAvl") }),
  z.object({ kind: z.literal("traversal"), order: traversalOrderSchema, keys: treeKeysSchema }),
]) satisfies z.ZodType<TreeGoal>;

export type PlaygroundGoal = z.infer<typeof playgroundGoalSchema>;

export const textBlockBodySchema = z.object({
  markdown: z.string().min(1),
});

export type TextBlockBody = z.infer<typeof textBlockBodySchema>;

export const diagramBlockBodySchema = z.object({
  startingKeys: treeKeysSchema,
  highlights: z.array(z.object({ key: treeKeySchema, state: nodeStateSchema })),
  caption: z.string(),
});

export type DiagramBlockBody = z.infer<typeof diagramBlockBodySchema>;

export const animationBlockBodySchema = z.object({
  startingKeys: treeKeysSchema,
  steps: z.array(operationStepSchema).min(1),
  autoplay: z.boolean(),
});

export type AnimationBlockBody = z.infer<typeof animationBlockBodySchema>;

export const playgroundBlockBodySchema = z.object({
  startingKeys: treeKeysSchema,
  allowedOperations: z.array(treeOperationSchema).min(1),
  instructions: z.string().min(1),
  goal: playgroundGoalSchema.optional(),
});

export type PlaygroundBlockBody = z.infer<typeof playgroundBlockBodySchema>;

export const codeTraceBlockBodySchema = z.object({
  algorithmCode: z.string().min(1),
  startingKeys: treeKeysSchema,
  operation: operationStepSchema,
});

export type CodeTraceBlockBody = z.infer<typeof codeTraceBlockBodySchema>;

export const contentBlockBodySchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("text"), body: textBlockBodySchema }),
  z.object({ type: z.literal("diagram"), body: diagramBlockBodySchema }),
  z.object({ type: z.literal("animation"), body: animationBlockBodySchema }),
  z.object({ type: z.literal("playground"), body: playgroundBlockBodySchema }),
  z.object({ type: z.literal("code_trace"), body: codeTraceBlockBodySchema }),
]);

export type ContentBlockBody = z.infer<typeof contentBlockBodySchema>;
