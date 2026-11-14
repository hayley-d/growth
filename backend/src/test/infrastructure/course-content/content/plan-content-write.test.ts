import { describe, expect, it } from "vitest";

import type { CheckedContent } from "@/infrastructure/course-content/content/check-content";
import type {
  ContentRows,
  QuestionRow,
} from "@/infrastructure/course-content/content/content-rows";
import {
  type ContentSnapshot,
  checkLookups,
  type Lookups,
  planContentWrite,
  requireId,
} from "@/infrastructure/course-content/content/plan-content-write";

const question: QuestionRow = {
  id: "question-1",
  lessonId: "lesson-a",
  reviewLessonId: "lesson-a",
  type: "multiple_choice",
  difficulty: 1,
  bloomsLevel: "remember",
  prompt: "Which?",
  generatorKey: null,
  generatorOptions: null,
  explanation: "Because.",
  tree: null,
  answer: null,
};

const rows = (overrides: Partial<ContentRows> = {}): ContentRows => ({
  units: [{ id: "unit-1", title: "Traversal", position: 1, treeMode: "bst" }],
  lessons: [
    {
      id: "lesson-a",
      unitId: "unit-1",
      title: "A",
      summary: "A",
      notePrompt: null,
      kind: "lesson",
      position: 1,
      objectives: ["A"],
    },
    {
      id: "lesson-b",
      unitId: "unit-1",
      title: "B",
      summary: "B",
      notePrompt: null,
      kind: "lesson",
      position: 2,
      objectives: ["B"],
    },
  ],
  questions: [question],
  answerOptions: [
    { id: "option-a", questionId: "question-1", text: "Yes", isCorrect: true },
    { id: "option-b", questionId: "question-1", text: "No", isCorrect: false },
  ],
  hints: [],
  questionSources: new Map([["question-1", { file: "01-a/questions.ts", key: "which" }]]),
  ...overrides,
});

const snapshot = (overrides: Partial<ContentSnapshot> = {}): ContentSnapshot => ({
  units: [{ id: "unit-1", title: "Traversal" }],
  lessons: [
    { id: "lesson-a", unitId: "unit-1", position: 1, isRetired: false },
    { id: "lesson-b", unitId: "unit-1", position: 2, isRetired: false },
  ],
  questions: [{ ...question, isRetired: false, answered: true }],
  answerOptions: [
    { id: "option-a", questionId: "question-1", text: "Yes", isCorrect: true, answered: true },
    { id: "option-b", questionId: "question-1", text: "No", isCorrect: false, answered: false },
  ],
  ...overrides,
});

describe("planContentWrite", () => {
  it("changes nothing when the files match the database", () => {
    expect(planContentWrite(rows(), snapshot())).toEqual({
      problems: [],
      retiredLessons: [],
      retiredQuestionIds: [],
      newQuestions: [],
      changedQuestions: [],
      deletedAnswerOptionIds: [],
      newAnswerOptions: [],
      changedAnswerOptions: [],
    });
  });

  it("writes into an empty database", () => {
    const plan = planContentWrite(
      rows(),
      snapshot({ units: [], lessons: [], questions: [], answerOptions: [] }),
    );
    expect(plan.problems).toEqual([]);
    expect(plan.retiredLessons).toEqual([]);
    expect(plan.newQuestions).toEqual([question]);
    expect(plan.newAnswerOptions).toEqual(rows().answerOptions);
  });

  it("retires a removed lesson at -1 and keeps lessons already retired in their places", () => {
    const plan = planContentWrite(
      rows({ lessons: rows().lessons.slice(0, 1) }),
      snapshot({
        lessons: [
          { id: "lesson-a", unitId: "unit-1", position: 1, isRetired: false },
          { id: "lesson-b", unitId: "unit-1", position: 2, isRetired: false },
          { id: "old-1", unitId: "unit-1", position: -1, isRetired: true },
          { id: "old-2", unitId: "unit-1", position: -2, isRetired: true },
        ],
      }),
    );
    expect(plan.retiredLessons).toEqual([
      { id: "old-1", position: -1 },
      { id: "old-2", position: -2 },
      { id: "lesson-b", position: -3 },
    ]);
  });

  it("numbers retired lessons separately in each unit", () => {
    const plan = planContentWrite(
      rows({ lessons: [] }),
      snapshot({
        lessons: [
          { id: "lesson-a", unitId: "unit-1", position: 1, isRetired: false },
          { id: "lesson-z", unitId: "unit-2", position: 1, isRetired: false },
        ],
        units: [{ id: "unit-1", title: "Traversal" }],
      }),
    );
    expect(plan.retiredLessons).toEqual([
      { id: "lesson-a", position: -1 },
      { id: "lesson-z", position: -1 },
    ]);
  });

  it("keeps ids when two lessons swap positions", () => {
    const swapped = rows().lessons.map((lesson) => ({ ...lesson, position: 3 - lesson.position }));
    const plan = planContentWrite(rows({ lessons: swapped }), snapshot());
    expect(plan.retiredLessons).toEqual([]);
  });

  it("brings a retired lesson back when its file returns", () => {
    const plan = planContentWrite(
      rows(),
      snapshot({
        lessons: [
          { id: "lesson-a", unitId: "unit-1", position: 1, isRetired: false },
          { id: "lesson-b", unitId: "unit-1", position: -1, isRetired: true },
        ],
      }),
    );
    expect(plan.retiredLessons).toEqual([]);
  });

  it("reports a unit removed from the files", () => {
    const plan = planContentWrite(
      rows(),
      snapshot({ units: [...snapshot().units, { id: "unit-2", title: "AVL" }] }),
    );
    expect(plan.problems).toEqual([
      { file: "units.ts", message: expect.stringContaining('Unit "AVL" is in the database') },
    ]);
  });

  it("retires a question removed from the files", () => {
    const plan = planContentWrite(
      rows({ questions: [], answerOptions: [] }),
      snapshot({ answerOptions: [] }),
    );
    expect(plan.retiredQuestionIds).toEqual(["question-1"]);
  });

  it("keeps the options of a retired question", () => {
    const plan = planContentWrite(rows({ questions: [], answerOptions: [] }), snapshot());
    expect(plan.deletedAnswerOptionIds).toEqual([]);
    expect(plan.problems).toEqual([]);
  });

  it("deletes a removed option nobody has answered", () => {
    const plan = planContentWrite(
      rows({ answerOptions: rows().answerOptions.slice(0, 1) }),
      snapshot(),
    );
    expect(plan.deletedAnswerOptionIds).toEqual(["option-b"]);
    expect(plan.problems).toEqual([]);
  });

  it("reports a removed option that learners have answered", () => {
    const plan = planContentWrite(
      rows({ answerOptions: rows().answerOptions.slice(1) }),
      snapshot(),
    );
    expect(plan.problems).toEqual([
      { file: "01-a/questions.ts", message: expect.stringContaining('("Yes") was removed') },
    ]);
  });

  it("doesn't retire a question that is already retired again", () => {
    const plan = planContentWrite(
      rows({ questions: [], answerOptions: [] }),
      snapshot({ questions: [{ ...question, isRetired: true, answered: true }] }),
    );
    expect(plan.retiredQuestionIds).toEqual([]);
  });

  it("updates only the rows that changed", () => {
    const plan = planContentWrite(
      rows({
        questions: [{ ...question, explanation: "Better." }],
        answerOptions: [
          { id: "option-a", questionId: "question-1", text: "Yes", isCorrect: true },
          { id: "option-b", questionId: "question-1", text: "No", isCorrect: true },
        ],
      }),
      snapshot(),
    );
    expect(plan.changedQuestions).toEqual([{ ...question, explanation: "Better." }]);
    expect(plan.changedAnswerOptions).toEqual([
      { id: "option-b", questionId: "question-1", text: "No", isCorrect: true },
    ]);
    expect(plan.newQuestions).toEqual([]);
    expect(plan.newAnswerOptions).toEqual([]);
  });

  it("compares JSON columns by value", () => {
    const answer = { type: "order_nodes", keys: [20, 10] };
    const plan = planContentWrite(
      rows({ questions: [{ ...question, answer }] }),
      snapshot({
        questions: [
          {
            ...question,
            answer: { keys: [20, 10], type: "order_nodes" },
            isRetired: false,
            answered: false,
          },
        ],
      }),
    );
    expect(plan.changedQuestions).toEqual([]);
  });

  it("brings a retired question back when its file returns", () => {
    const plan = planContentWrite(
      rows(),
      snapshot({ questions: [{ ...question, isRetired: true, answered: false }] }),
    );
    expect(plan.changedQuestions).toEqual([question]);
  });

  it("reports an answered option whose text changed", () => {
    const plan = planContentWrite(
      rows({
        answerOptions: [
          { id: "option-a", questionId: "question-1", text: "Yes!", isCorrect: true },
          { id: "option-b", questionId: "question-1", text: "Maybe", isCorrect: false },
        ],
      }),
      snapshot(),
    );
    expect(plan.problems).toEqual([
      {
        file: "01-a/questions.ts",
        message: expect.stringContaining('("Yes") was changed to "Yes!"'),
      },
    ]);
  });

  it("reports an answered question whose type changed", () => {
    const plan = planContentWrite(rows({ questions: [{ ...question, type: "text" }] }), snapshot());
    expect(plan.problems).toEqual([
      {
        file: "01-a/questions.ts",
        message: expect.stringContaining('Question "which" was answered as a multiple_choice'),
      },
    ]);
  });

  it("lets an unanswered question change type", () => {
    const plan = planContentWrite(
      rows({ questions: [{ ...question, type: "text" }] }),
      snapshot({ questions: [{ ...question, isRetired: false, answered: false }] }),
    );
    expect(plan.problems).toEqual([]);
  });
});

describe("checkLookups", () => {
  const lookups: Lookups = {
    learningStyleIds: new Map([["Visual", "visual-id"]]),
    codeLanguageIds: new Map([["java", "java-id"]]),
    algorithmIds: new Map([["preorder", "preorder-id"]]),
  };

  const content = (style: "visual" | "auditory", algorithm: string, language: string) =>
    ({
      units: [],
      lessons: [{ file: "01-a/lesson.ts", blocks: [{ style }] }],
      snippets: [{ file: `snippets/${algorithm}/${language}`, algorithm, language }],
      caseStudies: [],
    }) as unknown as CheckedContent;

  it("passes when every lookup is in the database", () => {
    expect(checkLookups(content("visual", "preorder", "java"), lookups)).toEqual([]);
  });

  it("names each style, algorithm and language that isn't seeded", () => {
    expect(checkLookups(content("auditory", "inorder", "rust"), lookups)).toEqual([
      { file: "01-a/lesson.ts", message: expect.stringContaining("Learning style") },
      {
        file: "snippets/inorder/rust",
        message: 'Algorithm "inorder" isn\'t in the database. Run the seed first',
      },
      {
        file: "snippets/inorder/rust",
        message: 'Code language "rust" isn\'t in the database. Run the seed first',
      },
    ]);
  });
});

describe("requireId", () => {
  it("returns the id and throws for a missing key", () => {
    const ids = new Map([["java", "java-id"]]);
    expect(requireId(ids, "java")).toBe("java-id");
    expect(() => requireId(ids, "rust")).toThrow(/No id for "rust"/);
  });
});
