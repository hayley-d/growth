import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import type { Prisma } from "@/generated/prisma/client";
import {
  type CheckedContent,
  ContentProblemsError,
  checkContent,
} from "@/infrastructure/course-content/content/check-content";
import {
  answerOptionId,
  lessonId,
  questionId,
  unitId,
} from "@/infrastructure/course-content/content/content-id";
import { readContent } from "@/infrastructure/course-content/content/read-content";
import {
  contentTransactionOptions,
  writeContentInTransaction,
} from "@/infrastructure/course-content/content/write-content";
import { prismaClient } from "@/infrastructure/database/prisma-client";
import { algorithms, codeLanguages, learningStyles } from "@/infrastructure/seed/reference-data";

type Transaction = Prisma.TransactionClient;

const fixtures = fileURLToPath(new URL("fixtures", import.meta.url));

const courseContent = fileURLToPath(new URL("../../../../../prisma/content", import.meta.url));

const adoptIdsMigration = fileURLToPath(
  new URL(
    "../../../../../prisma/migrations/20261106090000_adopt_seeded_content_ids/migration.sql",
    import.meta.url,
  ),
);

const testUserId = "content-loader-database-test-user";

const rollback = new Error("Roll back the test transaction");

const checked = async (root: string): Promise<CheckedContent> => {
  const { content, problems } = checkContent(await readContent(root), { complete: false });
  if (!content) throw new Error(JSON.stringify(problems));
  return content;
};

const withSecondLesson = (content: CheckedContent): CheckedContent => {
  const copy = structuredClone(content);
  const [first] = copy.lessons;
  if (!first) throw new Error("The fixtures need a lesson");
  copy.lessons.push({
    ...structuredClone(first),
    file: "02-second/lesson.ts",
    data: { ...first.data, key: "second", position: 2, title: "Second" },
    questions: [],
    generated: [],
  });
  return copy;
};

const clearContent = async (transaction: Transaction) => {
  await transaction.attemptAnswer.deleteMany({});
  await transaction.assessmentAttempt.deleteMany({});
  await transaction.dailyChallenge.deleteMany({});
  await transaction.lessonProgress.deleteMany({});
  await transaction.userMastery.deleteMany({});
  await transaction.lessonNote.deleteMany({});
  await transaction.caseStudy.deleteMany({});
  await transaction.contentBlock.deleteMany({});
  await transaction.hint.deleteMany({});
  await transaction.answerOption.deleteMany({});
  await transaction.question.deleteMany({});
  await transaction.codeSnippet.deleteMany({});
  await transaction.lesson.deleteMany({});
  await transaction.unit.deleteMany({});
  for (const style of learningStyles) {
    await transaction.learningStyle.upsert({
      where: { name: style.name },
      create: style,
      update: {},
    });
  }
  for (const language of codeLanguages) {
    await transaction.codeLanguage.upsert({
      where: { code: language.code },
      create: language,
      update: {},
    });
  }
  for (const algorithm of algorithms) {
    await transaction.algorithm.upsert({
      where: { code: algorithm.code },
      create: algorithm,
      update: {},
    });
  }
  await transaction.user.create({
    data: { id: testUserId, name: "Content test", email: `${testUserId}@example.com` },
  });
};

const inRolledBackTransaction = (work: (transaction: Transaction) => Promise<void>) =>
  expect(
    prismaClient.$transaction(async (transaction) => {
      await clearContent(transaction);
      await work(transaction);
      throw rollback;
    }, contentTransactionOptions),
  ).rejects.toBe(rollback);

const answerOption = async (transaction: Transaction, optionId: string, questionKey: string) => {
  const attempt = await transaction.assessmentAttempt.create({
    data: { userId: testUserId, lessonId: lessonId("binary-tree"), kind: "lesson_test" },
  });
  const attemptQuestion = await transaction.attemptQuestion.create({
    data: {
      assessmentAttemptId: attempt.id,
      questionId: questionId("binary-tree", questionKey),
      position: 1,
      difficulty: 1,
    },
  });
  await transaction.attemptAnswer.create({
    data: {
      assessmentAttemptId: attempt.id,
      questionId: questionId("binary-tree", questionKey),
      attemptQuestionId: attemptQuestion.id,
      answerOptionId: optionId,
      response: { optionId },
      isCorrect: true,
      difficulty: 1,
      ratingBefore: 1000,
      ratingAfter: 1010,
    },
  });
};

describe("writeContentInTransaction against Postgres", () => {
  it("loads the same content twice and writes almost nothing the second time", async () => {
    const content = await checked(fixtures);
    await inRolledBackTransaction(async (transaction) => {
      const first = await writeContentInTransaction(transaction, content);
      const second = await writeContentInTransaction(transaction, content);

      expect(first).toMatchObject({ questionsWritten: 4, answerOptionsWritten: 4 });
      expect(second).toMatchObject({
        questionsWritten: 0,
        answerOptionsWritten: 0,
        codeSnippetsWritten: 0,
        retiredLessons: 0,
        retiredQuestions: 0,
      });
      expect(await transaction.question.count()).toBe(4);
      expect(await transaction.codeLine.count()).toBe(5);
      expect(
        await transaction.lesson.findUnique({ where: { id: lessonId("binary-tree") } }),
      ).toMatchObject({ unitId: unitId("traversal"), position: 1, isRetired: false });
    });
  });

  it("swaps two lessons without breaking the position key", async () => {
    const content = withSecondLesson(await checked(fixtures));
    const swapped = structuredClone(content);
    for (const lesson of swapped.lessons) lesson.data.position = 3 - lesson.data.position;

    await inRolledBackTransaction(async (transaction) => {
      await writeContentInTransaction(transaction, content);
      await writeContentInTransaction(transaction, swapped);

      const lessons = await transaction.lesson.findMany({ orderBy: { position: "asc" } });
      expect(lessons.map((lesson) => [lesson.id, lesson.position])).toEqual([
        [lessonId("second"), 1],
        [lessonId("binary-tree"), 2],
      ]);
    });
  });

  it("retires a removed lesson, keeps its progress and brings it back", async () => {
    const content = withSecondLesson(await checked(fixtures));
    const withoutSecond = await checked(fixtures);

    await inRolledBackTransaction(async (transaction) => {
      await writeContentInTransaction(transaction, content);
      await transaction.lessonProgress.create({
        data: { userId: testUserId, lessonId: lessonId("second") },
      });

      await writeContentInTransaction(transaction, withoutSecond);
      expect(
        await transaction.lesson.findUnique({ where: { id: lessonId("second") } }),
      ).toMatchObject({ isRetired: true, position: -1 });

      await writeContentInTransaction(transaction, content);
      expect(
        await transaction.lesson.findUnique({ where: { id: lessonId("second") } }),
      ).toMatchObject({ isRetired: false, position: 2 });
      expect(await transaction.lessonProgress.count({ where: { userId: testUserId } })).toBe(1);
    });
  });

  it("refuses to remove or reword an option learners have answered", async () => {
    const content = await checked(fixtures);
    const optionId = answerOptionId("binary-tree", "root", "a");
    const removed = structuredClone(content);
    const reworded = structuredClone(content);
    const [removedRoot] = removed.lessons[0]?.questions ?? [];
    const [rewordedRoot] = reworded.lessons[0]?.questions ?? [];
    if (removedRoot?.type !== "multiple_choice" || rewordedRoot?.type !== "multiple_choice") {
      throw new Error("The fixtures need a multiple choice question first");
    }
    removedRoot.options = removedRoot.options.filter((option) => option.key !== "a");
    rewordedRoot.options = rewordedRoot.options.map((option) =>
      option.key === "a" ? { ...option, text: "Twenty" } : option,
    );

    await inRolledBackTransaction(async (transaction) => {
      await writeContentInTransaction(transaction, content);
      await answerOption(transaction, optionId, "root");

      await expect(writeContentInTransaction(transaction, removed)).rejects.toThrow(
        /\("20"\) was removed/,
      );
      await expect(writeContentInTransaction(transaction, reworded)).rejects.toBeInstanceOf(
        ContentProblemsError,
      );
      expect(await transaction.answerOption.findUnique({ where: { id: optionId } })).toMatchObject({
        text: "20",
      });
    });
  });

  it("replaces code lines when a snippet changes", async () => {
    const content = await checked(fixtures);
    const changed = structuredClone(content);
    const [snippet] = changed.snippets;
    if (!snippet) throw new Error("The fixtures need a snippet");
    snippet.source = `${snippet.source}\n`;
    snippet.lines = snippet.lines.map((line) => ({ ...line, lineNumber: line.lineNumber + 1 }));

    await inRolledBackTransaction(async (transaction) => {
      await writeContentInTransaction(transaction, content);
      const result = await writeContentInTransaction(transaction, changed);

      expect(result.codeSnippetsWritten).toBe(1);
      const lines = await transaction.codeLine.findMany({ orderBy: { lineNumber: "asc" } });
      expect(lines.map((line) => [line.stepKey, line.lineNumber])).toEqual(
        snippet.lines.map((line) => [line.stepKey, line.lineNumber]),
      );
    });
  });

  it("adopts units and lessons seeded with random ids before the loader", async () => {
    const content = await checked(courseContent);
    const legacyUnitId = crypto.randomUUID();
    const legacyLessonId = crypto.randomUUID();

    await inRolledBackTransaction(async (transaction) => {
      await transaction.unit.create({
        data: { id: legacyUnitId, title: "Binary trees and traversals", position: 1 },
      });
      await transaction.lesson.create({
        data: {
          id: legacyLessonId,
          unitId: legacyUnitId,
          title: "What is a binary tree",
          summary: "Meet nodes, children and the shape of a binary tree.",
          kind: "lesson",
          position: 1,
        },
      });
      await transaction.lessonProgress.create({
        data: { userId: testUserId, lessonId: legacyLessonId },
      });

      const statements = (await readFile(adoptIdsMigration, "utf8"))
        .split(";")
        .map((statement) => statement.trim())
        .filter(Boolean);
      for (const statement of statements) await transaction.$executeRawUnsafe(statement);

      await writeContentInTransaction(transaction, content);

      expect(await transaction.unit.count({ where: { id: legacyUnitId } })).toBe(0);
      expect(await transaction.lessonProgress.findMany({ where: { userId: testUserId } })).toEqual([
        expect.objectContaining({ lessonId: lessonId("binary-tree") }),
      ]);
    });
  });
});
