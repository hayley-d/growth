import { fileURLToPath } from "node:url";
import { describe, expect, it, vi } from "vitest";

import type { PrismaClient } from "@/generated/prisma/client";
import {
  type CheckedContent,
  ContentProblemsError,
  checkContent,
} from "@/infrastructure/course-content/content/check-content";
import { lessonId, questionId, unitId } from "@/infrastructure/course-content/content/content-id";
import { readContent } from "@/infrastructure/course-content/content/read-content";
import {
  contentTransactionOptions,
  positionShift,
  writeContent,
  writeContentInTransaction,
} from "@/infrastructure/course-content/content/write-content";

const fixtures = fileURLToPath(new URL("fixtures", import.meta.url));

const loadFixtures = async (): Promise<CheckedContent> => {
  const { content, problems } = checkContent(await readContent(fixtures), { complete: false });
  if (!content) throw new Error(JSON.stringify(problems));
  return content;
};

type FindManyResults = Partial<Record<string, unknown[]>>;

const createTransaction = (results: FindManyResults = {}) => {
  const calls: string[] = [];
  const model = (name: string) => {
    const record = (method: string, result: (argument: unknown) => unknown) =>
      vi.fn(async (argument?: unknown) => {
        calls.push(`${name}.${method}`);
        return result(argument);
      });
    return {
      findMany: record("findMany", () => results[name] ?? []),
      upsert: record("upsert", () => ({ id: `${name}-id` })),
      update: record("update", () => ({})),
      updateMany: record("updateMany", () => ({ count: 0 })),
      deleteMany: record("deleteMany", () => ({ count: 0 })),
      createMany: record("createMany", () => ({ count: 0 })),
    };
  };
  const transaction = {
    learningStyle: model("learningStyle"),
    codeLanguage: model("codeLanguage"),
    algorithm: model("algorithm"),
    unit: model("unit"),
    lesson: model("lesson"),
    contentBlock: model("contentBlock"),
    question: model("question"),
    answerOption: model("answerOption"),
    hint: model("hint"),
    codeSnippet: model("codeSnippet"),
    codeLine: model("codeLine"),
    caseStudy: model("caseStudy"),
  };
  return { transaction, calls };
};

const seededLookups: FindManyResults = {
  learningStyle: [{ id: "visual-id", name: "Visual" }],
  codeLanguage: [{ id: "pseudocode-id", code: "pseudocode" }],
  algorithm: [{ id: "preorder-id", code: "preorder" }],
};

const run = async (results: FindManyResults = seededLookups) => {
  const { transaction, calls } = createTransaction(results);
  const result = await writeContentInTransaction(
    transaction as unknown as Parameters<typeof writeContentInTransaction>[0],
    await loadFixtures(),
  );
  return { transaction, calls, result };
};

describe("writeContentInTransaction", () => {
  it("moves positions out of the way before writing units and lessons", async () => {
    const { transaction, calls } = await run();
    const shift = { data: { position: { decrement: positionShift } } };
    expect(transaction.unit.updateMany).toHaveBeenCalledWith(shift);
    expect(transaction.lesson.updateMany).toHaveBeenCalledWith(shift);
    expect(calls.indexOf("lesson.updateMany")).toBeLessThan(calls.indexOf("unit.upsert"));
    expect(calls.indexOf("unit.upsert")).toBeLessThan(calls.indexOf("lesson.upsert"));
  });

  it("writes units and lessons with ids from their keys", async () => {
    const { transaction } = await run();
    expect(transaction.unit.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: unitId("traversal") } }),
    );
    expect(transaction.lesson.upsert).toHaveBeenCalledWith({
      where: { id: lessonId("binary-tree") },
      create: expect.objectContaining({
        id: lessonId("binary-tree"),
        unitId: unitId("traversal"),
        objectives: ["Name the parts of a binary tree"],
        isRetired: false,
      }),
      update: expect.objectContaining({ position: 1, isRetired: false }),
    });
  });

  it("uses the same ids on every run", async () => {
    const first = await run();
    const second = await run();
    expect(second.transaction.question.upsert.mock.calls).toEqual(
      first.transaction.question.upsert.mock.calls,
    );
  });

  it("retires lessons and questions that left the files", async () => {
    const { transaction, result } = await run({
      ...seededLookups,
      unit: [{ id: unitId("traversal"), title: "Traversal" }],
      lesson: [
        { id: lessonId("binary-tree"), unitId: unitId("traversal"), position: 1, isRetired: false },
        { id: "gone", unitId: unitId("traversal"), position: 2, isRetired: false },
      ],
      question: [{ id: questionId("binary-tree", "root") }, { id: "old-question" }],
    });
    expect(transaction.lesson.update).toHaveBeenCalledWith({
      where: { id: "gone" },
      data: { isRetired: true, position: -1 },
    });
    expect(transaction.question.updateMany).toHaveBeenCalledWith({
      where: { id: { in: ["old-question"] } },
      data: { isRetired: true },
    });
    expect(result).toMatchObject({ retiredLessons: 1, retiredQuestions: 1 });
  });

  it("replaces blocks, hints and code lines, and stores generated questions without text", async () => {
    const { transaction, result } = await run();
    expect(transaction.contentBlock.createMany).toHaveBeenCalledWith({
      data: expect.arrayContaining([
        expect.objectContaining({ type: "diagram", learningStyleId: "visual-id", position: 1 }),
        expect.objectContaining({ type: "text", learningStyleId: null, position: 1 }),
      ]),
    });
    expect(transaction.question.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: questionId("binary-tree", "pre-order-easy") },
        update: expect.objectContaining({
          prompt: null,
          explanation: "",
          generatorKey: "traversal-order",
        }),
      }),
    );
    expect(transaction.codeLine.createMany).toHaveBeenCalledWith({
      data: expect.arrayContaining([
        { codeSnippetId: "codeSnippet-id", stepKey: "preorder.visit", lineNumber: 3 },
      ]),
    });
    expect(result).toEqual({
      units: 1,
      lessons: 1,
      retiredLessons: 0,
      contentBlocks: 3,
      questions: 4,
      retiredQuestions: 0,
      answerOptions: 4,
      hints: 6,
      codeSnippets: 1,
      codeLines: 4,
      caseStudies: 1,
    });
  });

  it("fails before writing when a learning style isn't seeded", async () => {
    const { transaction } = createTransaction({ ...seededLookups, learningStyle: [] });
    await expect(
      writeContentInTransaction(
        transaction as unknown as Parameters<typeof writeContentInTransaction>[0],
        await loadFixtures(),
      ),
    ).rejects.toBeInstanceOf(ContentProblemsError);
    expect(transaction.unit.upsert).not.toHaveBeenCalled();
  });

  it("fails before writing when a unit was removed from the files", async () => {
    const { transaction } = createTransaction({
      ...seededLookups,
      unit: [{ id: "old-unit", title: "Old unit" }],
    });
    await expect(
      writeContentInTransaction(
        transaction as unknown as Parameters<typeof writeContentInTransaction>[0],
        await loadFixtures(),
      ),
    ).rejects.toThrow(/Unit "Old unit" is in the database/);
    expect(transaction.unit.updateMany).not.toHaveBeenCalled();
  });
});

describe("writeContent", () => {
  it("runs everything in one transaction with a long timeout", async () => {
    const { transaction } = createTransaction(seededLookups);
    const $transaction = vi.fn(async (callback: (client: unknown) => unknown) =>
      callback(transaction),
    );
    const client = { $transaction } as unknown as PrismaClient;

    await writeContent(client, await loadFixtures());

    expect($transaction).toHaveBeenCalledWith(expect.any(Function), contentTransactionOptions);
  });
});
