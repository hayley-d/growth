import { makeGetAlgorithmSnippet } from "@/application/course-content/queries/get-algorithm-snippet";
import { makeListAlgorithms } from "@/application/course-content/queries/list-algorithms";
import { authHandler, getSession } from "@/infrastructure/auth/auth";
import { environment } from "@/infrastructure/config/environment";
import {
  PrismaAlgorithmRepository,
  PrismaCodeLanguageRepository,
  PrismaCodeLineRepository,
  PrismaCodeSnippetRepository,
} from "@/infrastructure/course-content/repositories";
import { prismaClient } from "@/infrastructure/database/prisma-client";
import { registerGracefulShutdown } from "@/infrastructure/lifecycle/register-graceful-shutdown";
import { registerProcessErrorHandlers } from "@/infrastructure/lifecycle/register-process-error-handlers";
import { createPinoLogger } from "@/infrastructure/logging/pino-logger";
import { PrismaUserProfileRepository } from "@/infrastructure/user/repositories";
import { createAlgorithmController } from "@/presentation/controllers/algorithm-controller";
import { createApplication } from "@/presentation/http/create-application";

const logger = createPinoLogger(environment.LOG_LEVEL);
registerProcessErrorHandlers(logger);

const algorithmRepository = new PrismaAlgorithmRepository(prismaClient);

const algorithmController = createAlgorithmController({
  listAlgorithms: makeListAlgorithms({ algorithmRepository }),
  getAlgorithmSnippet: makeGetAlgorithmSnippet({
    algorithmRepository,
    codeLanguageRepository: new PrismaCodeLanguageRepository(prismaClient),
    codeSnippetRepository: new PrismaCodeSnippetRepository(prismaClient),
    codeLineRepository: new PrismaCodeLineRepository(prismaClient),
    userProfileRepository: new PrismaUserProfileRepository(prismaClient),
  }),
});

const application = createApplication({ logger, authHandler, getSession, algorithmController });

const server = Bun.serve({ port: environment.PORT, fetch: application.fetch });
logger.info(`Server listening on http://localhost:${environment.PORT}`);

registerGracefulShutdown({
  server,
  logger,
  cleanups: [() => prismaClient.$disconnect()],
});
