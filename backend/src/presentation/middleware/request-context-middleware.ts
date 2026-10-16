import { randomUUID } from "node:crypto";
import type { RequestHandler } from "express";

import { requestContext } from "@/application/context/request-context";

export const requestContextMiddleware: RequestHandler = (_request, response, next) => {
  const requestId = randomUUID();
  response.setHeader("x-request-id", requestId);
  requestContext.run({ requestId }, next);
};
