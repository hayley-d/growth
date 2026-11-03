import type { Prisma, PrismaClient } from "@/generated/prisma/client";
import {
  type CheckedContent,
  type ContentProblem,
  ContentProblemsError,
} from "@/infrastructure/course-content/content/check-content";
import { lessonId } from "@/infrastructure/course-content/content/content-id";
import {
  type ContentRows,
  toContentRows,
} from "@/infrastructure/course-content/content/content-rows";
import { learningStyleNames } from "@/infrastructure/course-content/content/content-schema";
import {
  type ContentSnapshot,
  planContentWrite,
} from "@/infrastructure/course-content/content/plan-content-write";
import { toJsonInput, toNullableJsonInput } from "@/infrastructure/database/json-input";
import { withPrismaErrors } from "@/infrastructure/database/prisma-errors";

export const positionShift = 1_000_000;

export const contentTransactionOptions = { maxWait: 10_000, timeout: 60_000 };

export type ContentWriteResult = {
  units: number;
  lessons: number;
  retiredLessons: number;
  contentBlocks: number;
  questions: number;
  retiredQuestions: number;
  answerOptions: number;
  hints: number;
  codeSnippets: number;
  codeLines: number;
  caseStudies: number;
};

type Transaction = Prisma.TransactionClient;

type Lookups = {
  learningStyleIds: Map<string, string>;
  codeLanguageIds: Map<string, string>;
  algorithmIds: Map<string, string>;
};

const failWith = (problems: ContentProblem[]): never => {
  throw new ContentProblemsError(problems);
};

const loadLookups = async (transaction: Transaction, content: CheckedContent): Promise<Lookups> => {
  const [learningStyles, codeLanguages, algorithms] = await Promise.all([
    transaction.learningStyle.findMany({ select: { id: true, name: true } }),
    transaction.codeLanguage.findMany({ select: { id: true, code: true } }),
    transaction.algorithm.findMany({ select: { id: true, code: true } }),
  ]);
  const lookups: Lookups = {
    learningStyleIds: new Map(learningStyles.map((style) => [style.name, style.id])),
    codeLanguageIds: new Map(codeLanguages.map((language) => [language.code, language.id])),
    algorithmIds: new Map(algorithms.map((algorithm) => [algorithm.code, algorithm.id])),
  };

  const problems: ContentProblem[] = [];
  for (const lesson of content.lessons) {
    for (const block of lesson.blocks) {
      if (block.style && !lookups.learningStyleIds.has(learningStyleNames[block.style])) {
        problems.push({
          file: lesson.file,
          message: `Learning style "${learningStyleNames[block.style]}" isn't in the database. Run the seed first`,
        });
      }
    }
  }
  for (const snippet of content.snippets) {
    if (!lookups.algorithmIds.has(snippet.algorithm)) {
      problems.push({
        file: snippet.file,
        message: `Algorithm "${snippet.algorithm}" isn't in the database. Run the seed first`,
      });
    }
    if (!lookups.codeLanguageIds.has(snippet.language)) {
      problems.push({
        file: snippet.file,
        message: `Code language "${snippet.language}" isn't in the database. Run the seed first`,
      });
    }
  }
  if (problems.length > 0) failWith(problems);
  return lookups;
};

const loadSnapshot = async (transaction: Transaction): Promise<ContentSnapshot> => {
  const [units, lessons, questions, answerOptions] = await Promise.all([
    transaction.unit.findMany({ select: { id: true, title: true } }),
    transaction.lesson.findMany({
      select: { id: true, unitId: true, position: true, isRetired: true },
    }),
    transaction.question.findMany({ select: { id: true } }),
    transaction.answerOption.findMany({
      select: {
        id: true,
        questionId: true,
        text: true,
        _count: { select: { attemptAnswers: true } },
      },
    }),
  ]);
  return {
    units,
    lessons,
    questionIds: questions.map((question) => question.id),
    answerOptions: answerOptions.map(({ _count, ...option }) => ({
      ...option,
      answered: _count.attemptAnswers > 0,
    })),
  };
};

const writeCourse = async (transaction: Transaction, rows: ContentRows) => {
  await transaction.unit.updateMany({ data: { position: { decrement: positionShift } } });
  await transaction.lesson.updateMany({ data: { position: { decrement: positionShift } } });

  for (const { id, ...unit } of rows.units) {
    await transaction.unit.upsert({ where: { id }, create: { id, ...unit }, update: unit });
  }
  for (const { id, ...lesson } of rows.lessons) {
    const data = { ...lesson, isRetired: false };
    await transaction.lesson.upsert({ where: { id }, create: { id, ...data }, update: data });
  }
};

const writeQuestions = async (transaction: Transaction, rows: ContentRows) => {
  for (const { id, generatorOptions, answer, ...question } of rows.questions) {
    const data = {
      ...question,
      generatorOptions: toNullableJsonInput(generatorOptions),
      answer: toNullableJsonInput(answer),
      isRetired: false,
    };
    await transaction.question.upsert({ where: { id }, create: { id, ...data }, update: data });
  }
  for (const { id, ...option } of rows.answerOptions) {
    await transaction.answerOption.upsert({
      where: { id },
      create: { id, ...option },
      update: option,
    });
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
        ? (lookups.learningStyleIds.get(learningStyleNames[block.style]) ?? null)
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
  const keptSnippetIds: string[] = [];
  let codeLines = 0;
  for (const snippet of content.snippets) {
    const algorithmId = lookups.algorithmIds.get(snippet.algorithm) ?? "";
    const codeLanguageId = lookups.codeLanguageIds.get(snippet.language) ?? "";
    const { id } = await transaction.codeSnippet.upsert({
      where: { algorithmId_codeLanguageId: { algorithmId, codeLanguageId } },
      create: { algorithmId, codeLanguageId, source: snippet.source },
      update: { source: snippet.source },
      select: { id: true },
    });
    keptSnippetIds.push(id);
    await transaction.codeLine.deleteMany({ where: { codeSnippetId: id } });
    await transaction.codeLine.createMany({
      data: snippet.lines.map((line) => ({ codeSnippetId: id, ...line })),
    });
    codeLines += snippet.lines.length;
  }
  await transaction.codeSnippet.deleteMany({ where: { id: { notIn: keptSnippetIds } } });
  return codeLines;
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
  const lookups = await loadLookups(transaction, content);
  const rows = toContentRows(content);
  const plan = planContentWrite(rows, await loadSnapshot(transaction));
  if (plan.problems.length > 0) failWith(plan.problems);

  await writeCourse(transaction, rows);
  for (const { id, position } of plan.retiredLessons) {
    await transaction.lesson.update({ where: { id }, data: { isRetired: true, position } });
  }
  const contentBlocks = await writeContentBlocks(transaction, content, lookups);

  await transaction.answerOption.deleteMany({ where: { id: { in: plan.deletedAnswerOptionIds } } });
  await writeQuestions(transaction, rows);
  await transaction.question.updateMany({
    where: { id: { in: plan.retiredQuestionIds } },
    data: { isRetired: true },
  });

  const codeLines = await writeSnippets(transaction, content, lookups);
  await writeCaseStudies(transaction, content);

  return {
    units: rows.units.length,
    lessons: rows.lessons.length,
    retiredLessons: plan.retiredLessons.length,
    contentBlocks,
    questions: rows.questions.length,
    retiredQuestions: plan.retiredQuestionIds.length,
    answerOptions: rows.answerOptions.length,
    hints: rows.hints.length,
    codeSnippets: content.snippets.length,
    codeLines,
    caseStudies: content.caseStudies.length,
  };
};

export const writeContent = (client: PrismaClient, content: CheckedContent) =>
  withPrismaErrors(() =>
    client.$transaction(
      (transaction) => writeContentInTransaction(transaction, content),
      contentTransactionOptions,
    ),
  );
