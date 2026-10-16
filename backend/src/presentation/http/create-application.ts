import express from "express";
import helmet from "helmet";

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
  const application = express();
  application.use(helmet());
  application.use(requestContextMiddleware);
  application.use(createRequestLogger(logger));
  application.use(express.json({ limit: "100kb" }));
  application.use("/api/health", healthRoutes);
  application.use(notFoundHandler);
  application.use(createErrorHandler(logger));
  return application;
};
