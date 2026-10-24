import type { ValidationTargets } from "hono";
import { validator } from "hono/validator";
import type { ZodType } from "zod";

export const validate = <Target extends keyof ValidationTargets, Schema extends ZodType>(
  target: Target,
  schema: Schema,
) => validator(target, (value) => schema.parse(value) as Schema["_zod"]["output"]);
