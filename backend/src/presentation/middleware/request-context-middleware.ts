import { randomUUID } from "node:crypto";
import type { MiddlewareHandler } from "hono";

import { requestContext } from "@/application/context/request-context";

export const requestContextMiddleware: MiddlewareHandler = async (context, next) => {
  const requestId = randomUUID();
  await requestContext.run({ requestId }, next);
  context.header("x-request-id", requestId);
};
