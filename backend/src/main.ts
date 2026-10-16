import { environment } from "@/infrastructure/config/environment";
import { prismaClient } from "@/infrastructure/database/prisma-client";
import { registerGracefulShutdown } from "@/infrastructure/lifecycle/register-graceful-shutdown";
import { registerProcessErrorHandlers } from "@/infrastructure/lifecycle/register-process-error-handlers";
import { createPinoLogger } from "@/infrastructure/logging/pino-logger";
import { createApplication } from "@/presentation/http/create-application";

const logger = createPinoLogger(environment.LOG_LEVEL);
registerProcessErrorHandlers(logger);

const application = createApplication({ logger });

const server = application.listen(environment.PORT, () => {
  logger.info(`Server listening on http://localhost:${environment.PORT}`);
});

registerGracefulShutdown({
  server,
  logger,
  cleanups: [() => prismaClient.$disconnect()],
});
