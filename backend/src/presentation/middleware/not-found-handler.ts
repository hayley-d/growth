import type { RequestHandler } from "express";

import { NotFoundError } from "@/domain/errors";

export const notFoundHandler: RequestHandler = (request) => {
  throw new NotFoundError(`Route not found: ${request.method} ${request.originalUrl}`);
};
