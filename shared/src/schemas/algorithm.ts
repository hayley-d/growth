import { z } from "zod";

const codeSchema = z
  .string()
  .max(64)
  .regex(/^[a-z0-9-]+$/, "Use lower case letters, digits and hyphens");

export const algorithmParamsSchema = z.object({
  code: codeSchema,
});

export type AlgorithmParams = z.infer<typeof algorithmParamsSchema>;

export const algorithmSnippetQuerySchema = z.object({
  language: codeSchema.optional(),
});

export type AlgorithmSnippetQuery = z.infer<typeof algorithmSnippetQuerySchema>;

const namedCodeSchema = z.object({
  code: z.string(),
  name: z.string(),
});

export const listAlgorithmsResponseSchema = z.object({
  data: z.object({
    algorithms: z.array(namedCodeSchema),
  }),
});

export type ListAlgorithmsResponse = z.infer<typeof listAlgorithmsResponseSchema>;

export const algorithmSnippetResponseSchema = z.object({
  data: z.object({
    algorithm: namedCodeSchema,
    language: namedCodeSchema,
    source: z.string(),
    lines: z.record(z.string(), z.int().positive()),
  }),
});

export type AlgorithmSnippetResponse = z.infer<typeof algorithmSnippetResponseSchema>;

export const listAlgorithmsSourceSchema = z
  .object({ algorithms: z.array(namedCodeSchema) })
  .transform(({ algorithms }) => ({ data: { algorithms } }))
  .pipe(listAlgorithmsResponseSchema);

export type ListAlgorithmsSource = z.input<typeof listAlgorithmsSourceSchema>;

export const toListAlgorithmsResponse = (
  algorithms: ListAlgorithmsSource["algorithms"],
): ListAlgorithmsResponse => listAlgorithmsSourceSchema.parse({ algorithms });

export const algorithmSnippetSourceSchema = z
  .object({
    algorithm: namedCodeSchema,
    language: namedCodeSchema,
    snippet: z.object({ source: z.string() }),
    codeLines: z.array(z.object({ stepKey: z.string(), lineNumber: z.int().positive() })),
  })
  .transform(({ algorithm, language, snippet, codeLines }) => ({
    data: {
      algorithm,
      language,
      source: snippet.source,
      lines: Object.fromEntries(codeLines.map((line) => [line.stepKey, line.lineNumber])),
    },
  }))
  .pipe(algorithmSnippetResponseSchema);

export type AlgorithmSnippetSource = z.input<typeof algorithmSnippetSourceSchema>;

export const toAlgorithmSnippetResponse = (
  source: AlgorithmSnippetSource,
): AlgorithmSnippetResponse => algorithmSnippetSourceSchema.parse(source);
