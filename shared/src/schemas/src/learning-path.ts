import { z } from "zod";

import { lessonKindSchema } from "@shared/schemas/src/lesson";

export const learningPathLessonStatusSchema = z.enum(["completed", "current", "locked"]);

export type LearningPathLessonStatus = z.infer<typeof learningPathLessonStatusSchema>;

const percentageSchema = z.int().min(0).max(100);

export const masteryLabels = ["Just started", "Getting there", "Strong"] as const;

export type MasteryLabel = (typeof masteryLabels)[number];

const gettingThereFrom = 40;
const strongFrom = 80;

export const masteryLabel = (mastery: number): MasteryLabel => {
  if (mastery >= strongFrom) return "Strong";
  if (mastery >= gettingThereFrom) return "Getting there";
  return "Just started";
};

const learningPathLessonSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  summary: z.string(),
  kind: lessonKindSchema,
  position: z.int(),
  status: learningPathLessonStatusSchema,
  mastery: percentageSchema,
});

export type LearningPathLesson = z.infer<typeof learningPathLessonSchema>;

const learningPathUnitSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  position: z.int(),
  progress: percentageSchema,
  lessons: z.array(learningPathLessonSchema),
});

export type LearningPathUnit = z.infer<typeof learningPathUnitSchema>;

export const learningPathResponseSchema = z.object({
  data: z.object({
    units: z.array(learningPathUnitSchema),
    progress: percentageSchema,
    currentLessonId: z.uuid().nullable(),
  }),
});

export type LearningPathResponse = z.infer<typeof learningPathResponseSchema>;

export const toLearningPathResponse = (
  data: z.input<typeof learningPathResponseSchema>["data"],
): LearningPathResponse => learningPathResponseSchema.parse({ data });
