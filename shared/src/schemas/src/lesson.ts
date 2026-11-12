import { z } from "zod";

import type { TreeMode } from "@shared/avl";
import { contentBlockBodySchema } from "@shared/schemas/src/content-block";

export const lessonKindSchema = z.enum(["lesson", "checkpoint"]);

export type LessonKind = z.infer<typeof lessonKindSchema>;

export const treeModeSchema = z.enum(["bst", "avl"]) satisfies z.ZodType<TreeMode>;

export const lessonResponseStatusSchema = z.enum(["completed", "current"]);

export type LessonResponseStatus = z.infer<typeof lessonResponseStatusSchema>;

export const lessonStepBlockSchema = contentBlockBodySchema.and(
  z.object({
    id: z.uuid(),
    transcript: z.string(),
    learningStyleId: z.uuid().nullable(),
  }),
);

export type LessonStepBlock = z.infer<typeof lessonStepBlockSchema>;

export const lessonStepSchema = z.object({
  position: z.int(),
  coreBlock: lessonStepBlockSchema,
  styleBlock: lessonStepBlockSchema.nullable(),
  otherBlocks: z.array(lessonStepBlockSchema),
});

export type LessonStep = z.infer<typeof lessonStepSchema>;

export const lessonResponseSchema = z.object({
  data: z.object({
    lesson: z.object({
      id: z.uuid(),
      title: z.string(),
      summary: z.string(),
      kind: lessonKindSchema,
      position: z.int(),
      notePrompt: z.string().nullable(),
      objectives: z.array(z.string()),
    }),
    unit: z.object({
      id: z.uuid(),
      title: z.string(),
      position: z.int(),
      treeMode: treeModeSchema,
    }),
    status: lessonResponseStatusSchema,
    previousLessonId: z.uuid().nullable(),
    nextLessonId: z.uuid().nullable(),
    steps: z.array(lessonStepSchema),
  }),
});

export type LessonResponse = z.infer<typeof lessonResponseSchema>;
