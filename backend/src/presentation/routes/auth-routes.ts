import { Hono } from "hono";

import type { AuthHandler } from "@/application/auth/session";

export const createAuthRoutes = (authHandler: AuthHandler) =>
  new Hono().all("/*", (context) => authHandler(context.req.raw));
