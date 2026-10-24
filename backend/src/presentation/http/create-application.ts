import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { HTTPException } from "hono/http-exception";
import { secureHeaders } from "hono/secure-headers";

import type { Logger } from "@/application/logging/logger";
import { createErrorHandler } from "@/presentation/middleware/error-handler";
import { notFoundHandler } from "@/presentation/middleware/not-found-handler";
import { requestContextMiddleware } from "@/presentation/middleware/request-context-middleware";
import { createRequestLogger } from "@/presentation/middleware/request-logger";
import { healthRoutes } from "@/presentation/routes/health-routes";

type ApplicationDependencies = {
  logger: Logger;
};

export const createApplication = ({ logger }: ApplicationDependencies) => {
  const application = new Hono();
  application.use(secureHeaders());
  application.use(requestContextMiddleware);
  application.use(createRequestLogger(logger));
  application.use(
    bodyLimit({
      maxSize: 100 * 1024,
      onError: () => {
        throw new HTTPException(413, { message: "Request body too large" });
      },
    }),
  );
  application.route("/api/health", healthRoutes);
  application.notFound(notFoundHandler);
  application.onError(createErrorHandler(logger));
  return application;
};
