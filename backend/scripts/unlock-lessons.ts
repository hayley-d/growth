import { makeUnlockLessons } from "@/application/learning-path/commands/unlock-lessons";
import { NotFoundError } from "@/domain/errors";
import { PrismaLessonRepository } from "@/infrastructure/course-content/repositories";
import { prismaClient } from "@/infrastructure/database/prisma-client";
import {
  PrismaLessonProgressRepository,
  PrismaUserRepository,
} from "@/infrastructure/user/repositories";

const usage = "Usage: bun run unlock <email> <count>";

const [email, countText] = process.argv.slice(2);
const count = Number(countText);

if (!email || !Number.isInteger(count) || count < 1) {
  console.error(usage);
  process.exit(1);
}

const unlockLessons = makeUnlockLessons({
  userRepository: new PrismaUserRepository(prismaClient),
  lessonRepository: new PrismaLessonRepository(prismaClient),
  lessonProgressRepository: new PrismaLessonProgressRepository(prismaClient),
});

try {
  const { unlocked, total } = await unlockLessons({ email, count });
  console.log(`Lessons 1 to ${unlocked} of ${total} are open for ${email}.`);
} catch (error) {
  if (!(error instanceof NotFoundError)) throw error;
  console.error(`No user has the email ${email}.`);
  process.exitCode = 1;
} finally {
  await prismaClient.$disconnect();
}
