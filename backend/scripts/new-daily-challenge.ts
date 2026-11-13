import { generatorKeySchema } from "@shared/schemas";
import { pickSeed } from "@/application/assessment/select-questions";
import { toChallengeDate } from "@/domain/assessment/daily-challenge-rotation";
import { PrismaQuestionRepository } from "@/infrastructure/assessment/repositories";
import { environment } from "@/infrastructure/config/environment";
import { prismaClient } from "@/infrastructure/database/prisma-client";

const localHostnames = new Set(["localhost", "127.0.0.1", "[::1]"]);

const usage = `Usage: bun run dev:daily-new [generator key]. Keys: ${generatorKeySchema.options.join(", ")}`;

const [keyArgument] = process.argv.slice(2);

try {
  if (!localHostnames.has(new URL(environment.DATABASE_URL).hostname)) {
    throw new Error("Refusing to run: not a local database");
  }
  if (keyArgument !== undefined && !generatorKeySchema.safeParse(keyArgument).success) {
    throw new Error(usage);
  }

  const questions = (await new PrismaQuestionRepository(prismaClient).listActiveGenerated()).filter(
    (question) => keyArgument === undefined || question.generatorKey === keyArgument,
  );
  const question = questions[Math.floor(Math.random() * questions.length)];
  if (!question) throw new Error(`No active generator questions for "${keyArgument}"`);

  const date = toChallengeDate(new Date());
  const day = date.toISOString().slice(0, 10);
  const seed = pickSeed(Math.random);

  const removed = await prismaClient.$transaction(async (transaction) => {
    const existing = await transaction.dailyChallenge.findUnique({ where: { date } });
    const { count } = existing
      ? await transaction.assessmentAttempt.deleteMany({ where: { dailyChallengeId: existing.id } })
      : { count: 0 };
    if (existing) await transaction.dailyChallenge.delete({ where: { id: existing.id } });
    await transaction.dailyChallenge.create({ data: { date, questionId: question.id, seed } });
    return count;
  });

  console.log(
    `New daily challenge for ${day}: ${question.generatorKey} at difficulty ${question.difficulty}, seed ${seed}. Removed ${removed} attempt${removed === 1 ? "" : "s"}. Reload /daily`,
  );
} finally {
  await prismaClient.$disconnect();
}
