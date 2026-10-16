import type { Server } from "node:http";

import type { Logger } from "@/application/logging/logger";

type GracefulShutdownOptions = {
  server: Server;
  logger: Logger;
  cleanups: Array<() => Promise<unknown>>;
  timeoutMilliseconds?: number;
};

export const registerGracefulShutdown = ({
  server,
  logger,
  cleanups,
  timeoutMilliseconds = 10_000,
}: GracefulShutdownOptions) => {
  let shuttingDown = false;

  const shutdown = async (signal: NodeJS.Signals) => {
    if (shuttingDown) return;
    shuttingDown = true;
    logger.info("Shutting down", { signal });

    const forceExit = setTimeout(() => {
      logger.error("Shutdown timed out, forcing exit", { timeoutMilliseconds });
      process.exit(1);
    }, timeoutMilliseconds);
    forceExit.unref();

    try {
      await new Promise<void>((resolve, reject) =>
        server.close((error) => (error ? reject(error) : resolve())),
      );
      for (const cleanup of cleanups) await cleanup();
      logger.info("Shutdown complete");
      process.exit(0);
    } catch (error) {
      logger.error("Shutdown failed", { error });
      process.exit(1);
    }
  };

  process.once("SIGTERM", shutdown);
  process.once("SIGINT", shutdown);
};
