import { z } from "zod";

export const errorIssueSchema = z.object({
  path: z.array(z.union([z.string(), z.number()])),
  message: z.string(),
  code: z.string().optional(),
});

export const errorResponseSchema = z.object({
  message: z.string(),
  issues: z.array(errorIssueSchema).optional(),
  requestId: z.string().optional(),
});

export type ErrorIssue = z.infer<typeof errorIssueSchema>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>;
