import type { Logger } from "@/application/logging/logger";
import type { PrismaClient } from "@/generated/prisma/client";
import {
  ContentProblemsError,
  checkContent,
} from "@/infrastructure/course-content/content/check-content";
import { readContent } from "@/infrastructure/course-content/content/read-content";
import { writeContent } from "@/infrastructure/course-content/content/write-content";

export type LoadContentOptions = {
  client: PrismaClient;
  root: string;
  logger: Logger;
};

export const loadContent = async ({ client, root, logger }: LoadContentOptions) => {
  const { problems, content } = checkContent(await readContent(root), { complete: false });
  if (!content) throw new ContentProblemsError(problems);
  const result = await writeContent(client, content);
  logger.info("Loaded course content", result);
  return result;
};

export const reportContentProblems = (error: unknown) => {
  if (!(error instanceof ContentProblemsError)) return false;
  console.error(error.message);
  process.exitCode = 1;
  return true;
};
