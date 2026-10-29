import { environment } from "@/infrastructure/config/environment";
import {
  PrismaCodeLanguageRepository,
  PrismaLearningStyleRepository,
} from "@/infrastructure/course-content/repositories";
import { prismaClient } from "@/infrastructure/database/prisma-client";
import { createPinoLogger } from "@/infrastructure/logging/pino-logger";
import { codeLanguages, learningStyles } from "@/infrastructure/seed/reference-data";
import { seedAdmin } from "@/infrastructure/seed/seed-admin";
import { seedCodeLanguages } from "@/infrastructure/seed/seed-code-languages";
import { seedLearningStyles } from "@/infrastructure/seed/seed-learning-styles";

const logger = createPinoLogger(environment.LOG_LEVEL);

try {
  logger.info(
    "Seeded learning styles",
    await seedLearningStyles(new PrismaLearningStyleRepository(prismaClient), learningStyles),
  );
  logger.info(
    "Seeded code languages",
    await seedCodeLanguages(new PrismaCodeLanguageRepository(prismaClient), codeLanguages),
  );
  await seedAdmin({
    databaseUrl: environment.DATABASE_URL,
    enabled: environment.SEED_DEV_ADMIN,
    logger,
  });
} finally {
  await prismaClient.$disconnect();
}
