import type { NotFoundHandler } from "hono";

import { NotFoundError } from "@/domain/errors";

export const notFoundHandler: NotFoundHandler = (context) => {
  throw new NotFoundError(`Route not found: ${context.req.method} ${context.req.path}`);
};
