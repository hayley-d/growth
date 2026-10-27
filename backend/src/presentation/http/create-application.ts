import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { HTTPException } from "hono/http-exception";
import { secureHeaders } from "hono/secure-headers";

import type { AuthHandler, GetSession } from "@/application/auth/session";
import type { Logger } from "@/application/logging/logger";
import { createAuthMiddleware } from "@/presentation/middleware/auth-middleware";
import { createErrorHandler } from "@/presentation/middleware/error-handler";
import { notFoundHandler } from "@/presentation/middleware/not-found-handler";
import { requestContextMiddleware } from "@/presentation/middleware/request-context-middleware";
import { createRequestLogger } from "@/presentation/middleware/request-logger";
import { createAuthRoutes } from "@/presentation/routes/auth-routes";
import { healthRoutes } from "@/presentation/routes/health-routes";

type ApplicationDependencies = {
  logger: Logger;
  authHandler: AuthHandler;
  getSession: GetSession;
};

export const createApplication = ({ logger, authHandler, getSession }: ApplicationDependencies) => {
  const application = new Hono();
  application.use(secureHeaders());
  application.use(requestContextMiddleware);
  application.use(createAuthMiddleware(getSession));
  application.use(createRequestLogger(logger));
  application.use(
    bodyLimit({
      maxSize: 100 * 1024,
      onError: () => {
        throw new HTTPException(413, { message: "Request body too large" });
      },
    }),
  );
  application.route("/api/auth", createAuthRoutes(authHandler));
  application.route("/api/health", healthRoutes);
  application.notFound(notFoundHandler);
  application.onError(createErrorHandler(logger));
  return application;
};
