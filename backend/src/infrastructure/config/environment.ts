import { z } from "zod";

const environmentSchema = z.object({
  DATABASE_URL: z.url(),
  PORT: z.coerce.number().int().positive().default(3000),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]).default("info"),
});

export type Environment = z.infer<typeof environmentSchema>;

export const environment: Environment = environmentSchema.parse(process.env);
