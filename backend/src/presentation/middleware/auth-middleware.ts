import type { MiddlewareHandler } from "hono";

import type { GetSession } from "@/application/auth/session";
import { requestContext } from "@/application/context/request-context";

export const createAuthMiddleware =
  (getSession: GetSession): MiddlewareHandler =>
  async (context, next) => {
    const session = await getSession(context.req.raw.headers);
    if (session) {
      requestContext.setUserId(session.userId);
      if (session.role) requestContext.setRole(session.role);
    }
    await next();
  };
