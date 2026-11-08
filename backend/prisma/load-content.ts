import { fileURLToPath } from "node:url";

import { environment } from "@/infrastructure/config/environment";
import {
  loadContent,
  reportContentProblems,
} from "@/infrastructure/course-content/content/load-content";
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
  if (!reportContentProblems(error)) throw error;
} finally {
  await prismaClient.$disconnect();
}
