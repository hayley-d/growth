import { z } from "zod";

export const learningStyleSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  description: z.string(),
});

export const listLearningStylesResponseSchema = z.object({
  data: z.object({
    learningStyles: z.array(learningStyleSchema),
  }),
});

export type ListLearningStylesResponse = z.infer<typeof listLearningStylesResponseSchema>;

export const toListLearningStylesResponse = (
  learningStyles: z.input<typeof learningStyleSchema>[],
): ListLearningStylesResponse =>
  listLearningStylesResponseSchema.parse({ data: { learningStyles } });

const codeLanguageSchema = z.object({
  id: z.uuid(),
  code: z.string(),
  name: z.string(),
});

export const listCodeLanguagesResponseSchema = z.object({
  data: z.object({
    codeLanguages: z.array(codeLanguageSchema),
  }),
});

export type ListCodeLanguagesResponse = z.infer<typeof listCodeLanguagesResponseSchema>;

export const toListCodeLanguagesResponse = (
  codeLanguages: z.input<typeof codeLanguageSchema>[],
): ListCodeLanguagesResponse => listCodeLanguagesResponseSchema.parse({ data: { codeLanguages } });
