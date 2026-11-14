import { makeGetTodaysChallenge } from "@/application/assessment/commands/get-todays-challenge";
import { getMastery, getNextDifficulty } from "@/domain/assessment/elo-rating";
import {
  PrismaDailyChallengeRepository,
  PrismaQuestionRepository,
} from "@/infrastructure/assessment/repositories";
import { auth } from "@/infrastructure/auth/auth";
import { environment } from "@/infrastructure/config/environment";
import { PrismaLessonRepository } from "@/infrastructure/course-content/repositories";
import { prismaClient } from "@/infrastructure/database/prisma-client";
import { PrismaLessonProgressRepository } from "@/infrastructure/user/repositories";

const localHostnames = new Set(["localhost", "127.0.0.1", "[::1]"]);

const demoEmail = "demo@growth.com";
const demoName = "Jensen Huang";
const demoPassword = "password";
const nextLessonTitle = "Double rotations";

const players = [
  "Linda Marshall",
  "Cobus Redelingshuys",
  "Stefan Gruner",
  "Thambo Nyathi",
  "Anna Bosman",
  "Will van Heerden",
  "Pula Rammoko",
  "Martin Olivier",
  "Nils Timm",
  "Avinash Singh",
  "Sean Macmillan",
];

const ensureUser = async (email: string, name: string, password: string) => {
  const authContext = await auth.$context;
  const existing = await authContext.internalAdapter.findUserByEmail(email);
  if (existing) {
    await authContext.internalAdapter.updatePassword(
      existing.user.id,
      await authContext.password.hash(password),
    );
    return existing.user.id;
  }
  const created = await auth.api.createUser({ body: { email, password, name, role: "user" } });
  return created.user.id;
};

try {
  if (!localHostnames.has(new URL(environment.DATABASE_URL).hostname)) {
    throw new Error("Refusing to run: not a local database");
  }

  const challenge = await makeGetTodaysChallenge({
    clock: { now: () => new Date() },
    dailyChallengeRepository: new PrismaDailyChallengeRepository(prismaClient),
    questionRepository: new PrismaQuestionRepository(prismaClient),
  })();

  const demoUserId = await ensureUser(demoEmail, demoName, demoPassword);
  await prismaClient.user.update({ where: { id: demoUserId }, data: { name: demoName } });
  const kinesthetic = await prismaClient.learningStyle.findUniqueOrThrow({
    where: { name: "Kinesthetic" },
  });
  const pseudocode = await prismaClient.codeLanguage.findFirstOrThrow({
    where: { code: "pseudocode" },
  });
  await prismaClient.userProfile.update({
    where: { userId: demoUserId },
    data: {
      learningStyleId: kinesthetic.id,
      codeLanguageId: pseudocode.id,
      textToSpeech: true,
      onboardingComplete: true,
    },
  });
  const lessons = await new PrismaLessonRepository(prismaClient).listAll();
  const nextIndex = lessons.findIndex((lesson) => lesson.title === nextLessonTitle);
  if (nextIndex < 0) throw new Error(`No lesson called "${nextLessonTitle}"`);
  await prismaClient.lessonProgress.deleteMany({ where: { userId: demoUserId } });
  await new PrismaLessonProgressRepository(prismaClient).completeAll(
    demoUserId,
    lessons.slice(0, nextIndex).map((lesson) => lesson.id),
    new Date(),
  );
  const completedLessons = lessons.slice(0, nextIndex);
  await prismaClient.userMastery.deleteMany({ where: { userId: demoUserId } });
  await prismaClient.userMastery.createMany({
    data: completedLessons.map((lesson, index) => {
      const rating = 1320 - ((index * 53) % 260);
      return {
        userId: demoUserId,
        lessonId: lesson.id,
        rating,
        mastery: getMastery(rating),
        currentDifficulty: getNextDifficulty(rating),
      };
    }),
  });
  await prismaClient.assessmentAttempt.deleteMany({
    where: { userId: demoUserId, dailyChallengeId: challenge.id },
  });

  for (const [index, name] of players.entries()) {
    const email = `${name.toLowerCase().replaceAll(" ", ".")}@growth.com`;
    const userId = await ensureUser(email, name, demoPassword);
    const seconds = 25 + index * 11;
    const finishedAt = new Date(Date.now() - (index + 1) * 60_000);
    const data = {
      kind: "daily_challenge" as const,
      score: 100 - (index % 3) * 10,
      passed: true,
      points: 100 - (index % 5) * 5,
      startedAt: new Date(finishedAt.getTime() - seconds * 1000),
      finishedAt,
    };
    await prismaClient.assessmentAttempt.upsert({
      where: { userId_dailyChallengeId: { userId, dailyChallengeId: challenge.id } },
      create: { userId, dailyChallengeId: challenge.id, ...data },
      update: data,
    });
  }

  console.log(`Demo ready: ${demoEmail} / ${demoPassword}, next lesson "${nextLessonTitle}"`);
} finally {
  await prismaClient.$disconnect();
}
