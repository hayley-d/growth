import type { MiddlewareHandler } from "hono";

import type { Logger } from "@/application/logging/logger";

const skippedPaths = new Set(["/api/health"]);

export const createRequestLogger =
  (logger: Logger): MiddlewareHandler =>
  async (context, next) => {
    if (skippedPaths.has(context.req.path)) {
      await next();
      return;
    }

    const startedAt = performance.now();
    await next();

    const { pathname, search } = new URL(context.req.url);
    const url = `${pathname}${search}`;
    const status = context.res.status;
    const data = {
      method: context.req.method,
      url,
      status,
      durationMilliseconds: Math.round(performance.now() - startedAt),
    };
    const message = `${context.req.method} ${url} ${status}`;
    if (status >= 500) logger.error(message, data);
    else if (status >= 400) logger.warn(message, data);
    else logger.info(message, data);
  };
