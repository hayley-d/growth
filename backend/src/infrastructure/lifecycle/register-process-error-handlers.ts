import type { Logger } from "@/application/logging/logger";

let registered = false;

export const registerProcessErrorHandlers = (logger: Logger) => {
  if (registered) return;
  registered = true;

  process.on("unhandledRejection", (reason) => {
    logger.error("Unhandled promise rejection", { error: reason });
  });

  process.on("uncaughtException", (error) => {
    logger.error("Uncaught exception", { error });
    process.exit(1);
  });
};
