import { toChallengeDate } from "@/domain/assessment/daily-challenge-rotation";
import { PrismaDailyChallengeRepository } from "@/infrastructure/assessment/repositories";
import { environment } from "@/infrastructure/config/environment";
import { prismaClient } from "@/infrastructure/database/prisma-client";

const localHostnames = new Set(["localhost", "127.0.0.1", "[::1]"]);

const [email] = process.argv.slice(2);

try {
  if (!localHostnames.has(new URL(environment.DATABASE_URL).hostname)) {
    throw new Error("Refusing to run: not a local database");
  }

  const user = email
    ? await prismaClient.user.findUnique({ where: { email: email.toLowerCase() } })
    : null;
  if (!user) {
    throw new Error(`Usage: bun run dev:daily-reset <email>. No user found for "${email}"`);
  }

  const date = toChallengeDate(new Date());
  const day = date.toISOString().slice(0, 10);
  const challenge = await new PrismaDailyChallengeRepository(prismaClient).findByDate(date);
  const { count } = challenge
    ? await prismaClient.assessmentAttempt.deleteMany({
        where: { userId: user.id, dailyChallengeId: challenge.id },
      })
    : { count: 0 };
  console.log(
    count > 0
      ? `Reset ${user.email}'s daily challenge for ${day}. Reload /daily to start it again`
      : `${user.email} hasn't started the daily challenge for ${day}, nothing to reset`,
  );
} finally {
  await prismaClient.$disconnect();
}
