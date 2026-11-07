import type { Logger } from "@/application/logging/logger";
import type { PrismaClient } from "@/generated/prisma/client";
import { loadContent } from "@/infrastructure/course-content/content/load-content";

export const seedContent = (client: PrismaClient, root: string, logger: Logger) =>
  loadContent({ client, root, logger });
