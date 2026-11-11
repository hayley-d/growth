import { environment } from "@/infrastructure/config/environment";
import { PrismaLessonRepository } from "@/infrastructure/course-content/repositories";
import { prismaClient } from "@/infrastructure/database/prisma-client";
import { PrismaLessonProgressRepository } from "@/infrastructure/user/repositories";

const localHostnames = new Set(["localhost", "127.0.0.1", "[::1]"]);

const [email, countArgument] = process.argv.slice(2);
const count = Number(countArgument);

try {
  if (!localHostnames.has(new URL(environment.DATABASE_URL).hostname)) {
    throw new Error("Refusing to run: not a local database");
  }

  const user = email
    ? await prismaClient.user.findUnique({ where: { email: email.toLowerCase() } })
    : null;
  if (!user)
    throw new Error(`Usage: bun run dev:progress <email> <0-12>. No user found for "${email}"`);

  const lessons = await new PrismaLessonRepository(prismaClient).listAll();
  if (!Number.isInteger(count) || count < 0 || count > lessons.length) {
    throw new Error(`The count must be a whole number from 0 to ${lessons.length}`);
  }

  await prismaClient.lessonProgress.deleteMany({ where: { userId: user.id } });
  await new PrismaLessonProgressRepository(prismaClient).completeAll(
    user.id,
    lessons.slice(0, count).map((lesson) => lesson.id),
    new Date(),
  );
  console.log(`${user.email} now has ${count} of ${lessons.length} lessons completed`);
} finally {
  await prismaClient.$disconnect();
}
