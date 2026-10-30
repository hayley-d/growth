import { environment } from "@/infrastructure/config/environment";
import {
  PrismaAlgorithmRepository,
  PrismaCodeLanguageRepository,
  PrismaCodeLineRepository,
  PrismaCodeSnippetRepository,
  PrismaLearningStyleRepository,
} from "@/infrastructure/course-content/repositories";
import { prismaClient } from "@/infrastructure/database/prisma-client";
import { createPinoLogger } from "@/infrastructure/logging/pino-logger";
import { verifyCodeLines } from "@/infrastructure/seed/check-code-lines";
import { algorithms, codeLanguages, learningStyles } from "@/infrastructure/seed/reference-data";
import { seedAdmin } from "@/infrastructure/seed/seed-admin";
import { seedAlgorithms } from "@/infrastructure/seed/seed-algorithms";
import { seedCodeLanguages } from "@/infrastructure/seed/seed-code-languages";
import { seedLearningStyles } from "@/infrastructure/seed/seed-learning-styles";

const logger = createPinoLogger(environment.LOG_LEVEL);

try {
  const algorithmRepository = new PrismaAlgorithmRepository(prismaClient);
  const codeLanguageRepository = new PrismaCodeLanguageRepository(prismaClient);
  logger.info(
    "Seeded learning styles",
    await seedLearningStyles(new PrismaLearningStyleRepository(prismaClient), learningStyles),
  );
  logger.info(
    "Seeded code languages",
    await seedCodeLanguages(codeLanguageRepository, codeLanguages),
  );
  logger.info("Seeded algorithms", await seedAlgorithms(algorithmRepository, algorithms));
  await seedAdmin({
    databaseUrl: environment.DATABASE_URL,
    enabled: environment.SEED_DEV_ADMIN,
    logger,
  });

  await verifyCodeLines(
    {
      algorithmRepository,
      codeLanguageRepository,
      codeSnippetRepository: new PrismaCodeSnippetRepository(prismaClient),
      codeLineRepository: new PrismaCodeLineRepository(prismaClient),
    },
    logger,
  );
} finally {
  await prismaClient.$disconnect();
}
