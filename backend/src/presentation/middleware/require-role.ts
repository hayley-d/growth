import type { MiddlewareHandler } from "hono";

import { requestContext } from "@/application/context/request-context";
import { hasRole, type UserRole } from "@/domain/auth/user-role";
import { ForbiddenError, UnauthorizedError } from "@/domain/errors";

const requireUserId = () => {
  if (!requestContext.getUserId()) throw new UnauthorizedError("Authentication required");
};

export const requireAuth: MiddlewareHandler = async (_context, next) => {
  requireUserId();
  await next();
};

export const requireRole =
  (role: UserRole): MiddlewareHandler =>
  async (_context, next) => {
    requireUserId();
    if (!hasRole(requestContext.getRole(), role))
      throw new ForbiddenError("Insufficient permissions");
    await next();
  };
