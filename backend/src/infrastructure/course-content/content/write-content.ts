import { Prisma, type PrismaClient } from "@/generated/prisma/client";
import {
  type CheckedContent,
  ContentProblemsError,
} from "@/infrastructure/course-content/content/check-content";
import { lessonId } from "@/infrastructure/course-content/content/content-id";
import {
  type ContentRows,
  type QuestionRow,
  toContentRows,
} from "@/infrastructure/course-content/content/content-rows";
import { learningStyleNames } from "@/infrastructure/course-content/content/content-schema";
import {
  type ContentSnapshot,
  type ContentWritePlan,
  checkLookups,
  type Lookups,
  planContentWrite,
  type RetiredLesson,
  requireId,
} from "@/infrastructure/course-content/content/plan-content-write";
import { toJsonInput, toNullableJsonInput } from "@/infrastructure/database/json-input";
import { withPrismaErrors } from "@/infrastructure/database/prisma-errors";

export const positionShift = 1_000_000;

export const contentLockKey = 108_000_108;

export const contentTransactionOptions = { maxWait: 10_000, timeout: 60_000 };

export type ContentWriteResult = {
  units: number;
  lessons: number;
  retiredLessons: number;
  contentBlocks: number;
  questions: number;
  questionsWritten: number;
  retiredQuestions: number;
  answerOptions: number;
  answerOptionsWritten: number;
  hints: number;
  codeSnippets: number;
  codeSnippetsWritten: number;
  codeLines: number;
  caseStudies: number;
};

type Transaction = Prisma.TransactionClient;

const loadLookups = async (transaction: Transaction): Promise<Lookups> => {
  const [learningStyles, codeLanguages, algorithms] = await Promise.all([
    transaction.learningStyle.findMany({ select: { id: true, name: true } }),
    transaction.codeLanguage.findMany({ select: { id: true, code: true } }),
    transaction.algorithm.findMany({ select: { id: true, code: true } }),
  ]);
  return {
    learningStyleIds: new Map(learningStyles.map((style) => [style.name, style.id])),
    codeLanguageIds: new Map(codeLanguages.map((language) => [language.code, language.id])),
    algorithmIds: new Map(algorithms.map((algorithm) => [algorithm.code, algorithm.id])),
  };
};

const loadSnapshot = async (transaction: Transaction): Promise<ContentSnapshot> => {
  const answeredCount = { _count: { select: { attemptAnswers: true } } } as const;
  const [units, lessons, questions, answerOptions] = await Promise.all([
    transaction.unit.findMany({ select: { id: true, title: true } }),
    transaction.lesson.findMany({
      select: { id: true, unitId: true, position: true, isRetired: true },
    }),
    transaction.question.findMany({
      select: {
        id: true,
        lessonId: true,
        reviewLessonId: true,
        type: true,
        difficulty: true,
        bloomsLevel: true,
        prompt: true,
        generatorKey: true,
        generatorOptions: true,
        explanation: true,
        tree: true,
        answer: true,
        isRetired: true,
        ...answeredCount,
      },
    }),
    transaction.answerOption.findMany({
      select: { id: true, questionId: true, text: true, isCorrect: true, ...answeredCount },
    }),
  ]);
  return {
    units,
    lessons,
    questions: questions.map(({ _count, ...question }) => ({
      ...question,
      answered: _count.attemptAnswers > 0,
    })),
    answerOptions: answerOptions.map(({ _count, ...option }) => ({
      ...option,
      answered: _count.attemptAnswers > 0,
    })),
  };
};

const moveAllPositionsAside = async (transaction: Transaction) => {
  await transaction.unit.updateMany({ data: { position: { decrement: positionShift } } });
  await transaction.lesson.updateMany({ data: { position: { decrement: positionShift } } });
};

const writeUnitsAndLessons = async (transaction: Transaction, rows: ContentRows) => {
  for (const { id, ...unit } of rows.units) {
    await transaction.unit.upsert({ where: { id }, create: { id, ...unit }, update: unit });
  }
  for (const { id, ...lesson } of rows.lessons) {
    const data = { ...lesson, isRetired: false };
    await transaction.lesson.upsert({ where: { id }, create: { id, ...data }, update: data });
  }
};

const retireLessons = async (transaction: Transaction, retiredLessons: RetiredLesson[]) => {
  for (const { id, position } of retiredLessons) {
    await transaction.lesson.update({ where: { id }, data: { isRetired: true, position } });
  }
};

const toQuestionData = ({ generatorOptions, answer, ...question }: QuestionRow) => ({
  ...question,
  generatorOptions: toNullableJsonInput(generatorOptions),
  answer: toNullableJsonInput(answer),
  isRetired: false,
});

const writeQuestions = async (
  transaction: Transaction,
  rows: ContentRows,
  plan: ContentWritePlan,
) => {
  await transaction.answerOption.deleteMany({ where: { id: { in: plan.deletedAnswerOptionIds } } });
  await transaction.question.createMany({ data: plan.newQuestions.map(toQuestionData) });
  for (const { id, ...question } of plan.changedQuestions.map(toQuestionData)) {
    await transaction.question.update({ where: { id }, data: question });
  }
  await transaction.question.updateMany({
    where: { id: { in: plan.retiredQuestionIds } },
    data: { isRetired: true },
  });
  await transaction.answerOption.createMany({ data: plan.newAnswerOptions });
  for (const { id, ...option } of plan.changedAnswerOptions) {
    await transaction.answerOption.update({ where: { id }, data: option });
  }
  await transaction.hint.deleteMany({
    where: { questionId: { in: rows.questions.map((question) => question.id) } },
  });
  await transaction.hint.createMany({ data: rows.hints });
};

const writeContentBlocks = async (
  transaction: Transaction,
  content: CheckedContent,
  lookups: Lookups,
) => {
  const blocks = content.lessons.flatMap((lesson) =>
    lesson.blocks.map((block) => ({
      lessonId: lessonId(lesson.data.key),
      learningStyleId: block.style
        ? requireId(lookups.learningStyleIds, learningStyleNames[block.style])
        : null,
      type: block.type,
      body: toJsonInput(block.body),
      transcript: block.transcript,
      position: block.position,
    })),
  );
  await transaction.contentBlock.deleteMany({
    where: { lessonId: { in: content.lessons.map((lesson) => lessonId(lesson.data.key)) } },
  });
  await transaction.contentBlock.createMany({ data: blocks });
  return blocks.length;
};

const writeSnippets = async (
  transaction: Transaction,
  content: CheckedContent,
  lookups: Lookups,
) => {
  const existing = await transaction.codeSnippet.findMany({
    select: { id: true, algorithmId: true, codeLanguageId: true, source: true },
  });
  const keptSnippetIds: string[] = [];
  const rewritten: { id: string; lines: CheckedContent["snippets"][number]["lines"] }[] = [];

  for (const snippet of content.snippets) {
    const algorithmId = requireId(lookups.algorithmIds, snippet.algorithm);
    const codeLanguageId = requireId(lookups.codeLanguageIds, snippet.language);
    const stored = existing.find(
      (candidate) =>
        candidate.algorithmId === algorithmId && candidate.codeLanguageId === codeLanguageId,
    );
    if (stored?.source === snippet.source) {
      keptSnippetIds.push(stored.id);
      continue;
    }
    const { id } = stored
      ? await transaction.codeSnippet.update({
          where: { id: stored.id },
          data: { source: snippet.source },
          select: { id: true },
        })
      : await transaction.codeSnippet.create({
          data: { algorithmId, codeLanguageId, source: snippet.source },
          select: { id: true },
        });
    keptSnippetIds.push(id);
    rewritten.push({ id, lines: snippet.lines });
  }

  await transaction.codeSnippet.deleteMany({ where: { id: { notIn: keptSnippetIds } } });
  await transaction.codeLine.deleteMany({
    where: { codeSnippetId: { in: rewritten.map((snippet) => snippet.id) } },
  });
  await transaction.codeLine.createMany({
    data: rewritten.flatMap(({ id, lines }) =>
      lines.map((line) => ({ codeSnippetId: id, ...line })),
    ),
  });
  return {
    codeSnippetsWritten: rewritten.length,
    codeLines: content.snippets.reduce((total, snippet) => total + snippet.lines.length, 0),
  };
};

const writeCaseStudies = async (transaction: Transaction, content: CheckedContent) => {
  await transaction.caseStudy.deleteMany({});
  await transaction.caseStudy.createMany({
    data: content.caseStudies.map(({ data }) => ({
      lessonId: lessonId(data.lesson),
      title: data.title,
      scenario: data.scenario,
      body: data.body,
      task: toJsonInput(data.task),
      position: data.position,
    })),
  });
};

export const writeContentInTransaction = async (
  transaction: Transaction,
  content: CheckedContent,
): Promise<ContentWriteResult> => {
  await transaction.$executeRaw`SELECT pg_advisory_xact_lock(${contentLockKey}::bigint)`;
  const lookups = await loadLookups(transaction);
  const rows = toContentRows(content);
  const plan = planContentWrite(rows, await loadSnapshot(transaction));
  const problems = [...checkLookups(content, lookups), ...plan.problems];
  if (problems.length > 0) throw new ContentProblemsError(problems);

  await moveAllPositionsAside(transaction);
  await writeUnitsAndLessons(transaction, rows);
  await retireLessons(transaction, plan.retiredLessons);
  const contentBlocks = await writeContentBlocks(transaction, content, lookups);
  await writeQuestions(transaction, rows, plan);
  const snippets = await writeSnippets(transaction, content, lookups);
  await writeCaseStudies(transaction, content);

  return {
    units: rows.units.length,
    lessons: rows.lessons.length,
    retiredLessons: plan.retiredLessons.length,
    contentBlocks,
    questions: rows.questions.length,
    questionsWritten: plan.newQuestions.length + plan.changedQuestions.length,
    retiredQuestions: plan.retiredQuestionIds.length,
    answerOptions: rows.answerOptions.length,
    answerOptionsWritten: plan.newAnswerOptions.length + plan.changedAnswerOptions.length,
    hints: rows.hints.length,
    codeSnippets: content.snippets.length,
    ...snippets,
    caseStudies: content.caseStudies.length,
  };
};

const isTransactionTimeout = (error: unknown) =>
  error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2028";

export const writeContent = async (client: PrismaClient, content: CheckedContent) => {
  try {
    return await withPrismaErrors(() =>
      client.$transaction(
        (transaction) => writeContentInTransaction(transaction, content),
        contentTransactionOptions,
      ),
    );
  } catch (error) {
    if (!isTransactionTimeout(error)) throw error;
    throw new Error(
      `The content load took longer than ${contentTransactionOptions.timeout / 1000} seconds, so nothing was written. Raise contentTransactionOptions.timeout in write-content.ts`,
      { cause: error },
    );
  }
};
