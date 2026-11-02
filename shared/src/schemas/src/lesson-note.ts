import { z } from "zod";

export const lessonNoteBodySchema = z.string().max(2000);

export type LessonNoteBody = z.infer<typeof lessonNoteBodySchema>;

export const saveLessonNoteRequestSchema = z.object({
  body: lessonNoteBodySchema,
});

export type SaveLessonNoteRequest = z.infer<typeof saveLessonNoteRequestSchema>;

export const lessonNoteResponseSchema = z.object({
  data: z.object({
    lessonId: z.uuid(),
    body: z.string(),
    updatedAt: z.iso.datetime().nullable(),
  }),
});

export type LessonNoteResponse = z.infer<typeof lessonNoteResponseSchema>;
