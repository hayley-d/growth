import type { RequestHandler } from "express";

import type { Logger } from "@/application/logging/logger";

const skippedPaths = new Set(["/api/health"]);

export const createRequestLogger =
  (logger: Logger): RequestHandler =>
  (request, response, next) => {
    if (skippedPaths.has(request.path)) {
      next();
      return;
    }

    const startedAt = performance.now();
    response.on("finish", () => {
      const status = response.statusCode;
      const data = {
        method: request.method,
        url: request.originalUrl,
        status,
        durationMilliseconds: Math.round(performance.now() - startedAt),
      };
      const message = `${request.method} ${request.originalUrl} ${status}`;
      if (status >= 500) logger.error(message, data);
      else if (status >= 400) logger.warn(message, data);
      else logger.info(message, data);
    });
    next();
  };
