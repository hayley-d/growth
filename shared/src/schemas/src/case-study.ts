import type { z } from "zod";

import { playgroundBlockBodySchema, playgroundGoalSchema } from "@shared/schemas/src/content-block";

export const caseStudyTaskSchema = playgroundBlockBodySchema.extend({
  goal: playgroundGoalSchema,
});

export type CaseStudyTask = z.infer<typeof caseStudyTaskSchema>;
