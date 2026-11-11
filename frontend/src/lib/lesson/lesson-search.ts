import { z } from "zod";

export const lessonSearchSchema = z.object({
  step: z.coerce.number().int().min(1).optional().catch(undefined),
});

export type LessonSearch = z.infer<typeof lessonSearchSchema>;

export const clampStep = (step: number | undefined, finishStep: number) =>
  Math.min(Math.max(step ?? 1, 1), Math.max(finishStep, 1));
