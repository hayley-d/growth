import { fileURLToPath } from "node:url";

import { environment } from "@/infrastructure/config/environment";
import { ContentProblemsError } from "@/infrastructure/course-content/content/check-content";
import { loadContent } from "@/infrastructure/course-content/content/load-content";
import { prismaClient } from "@/infrastructure/database/prisma-client";
import { createPinoLogger } from "@/infrastructure/logging/pino-logger";

const logger = createPinoLogger(environment.LOG_LEVEL);

try {
  await loadContent({
    client: prismaClient,
    root: fileURLToPath(new URL("content", import.meta.url)),
    logger,
  });
} catch (error) {
  if (!(error instanceof ContentProblemsError)) throw error;
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await prismaClient.$disconnect();
}
