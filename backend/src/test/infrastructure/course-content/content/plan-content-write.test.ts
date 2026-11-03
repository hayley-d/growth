import { describe, expect, it } from "vitest";

import type { ContentRows } from "@/infrastructure/course-content/content/content-rows";
import {
  type ContentSnapshot,
  planContentWrite,
} from "@/infrastructure/course-content/content/plan-content-write";

const rows = (overrides: Partial<ContentRows> = {}): ContentRows => ({
  units: [{ id: "unit-1", title: "Traversal", position: 1 }],
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
  questions: [
    {
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
    },
  ],
  answerOptions: [
    { id: "option-a", questionId: "question-1", text: "Yes", isCorrect: true },
    { id: "option-b", questionId: "question-1", text: "No", isCorrect: false },
  ],
  hints: [],
  questionFiles: new Map([["question-1", "01-a/questions.ts"]]),
  ...overrides,
});

const snapshot = (overrides: Partial<ContentSnapshot> = {}): ContentSnapshot => ({
  units: [{ id: "unit-1", title: "Traversal" }],
  lessons: [
    { id: "lesson-a", unitId: "unit-1", position: 1, isRetired: false },
    { id: "lesson-b", unitId: "unit-1", position: 2, isRetired: false },
  ],
  questionIds: ["question-1"],
  answerOptions: [
    { id: "option-a", questionId: "question-1", text: "Yes", answered: true },
    { id: "option-b", questionId: "question-1", text: "No", answered: false },
  ],
  ...overrides,
});

describe("planContentWrite", () => {
  it("changes nothing when the files match the database", () => {
    expect(planContentWrite(rows(), snapshot())).toEqual({
      problems: [],
      retiredLessons: [],
      retiredQuestionIds: [],
      deletedAnswerOptionIds: [],
    });
  });

  it("writes into an empty database", () => {
    const plan = planContentWrite(
      rows(),
      snapshot({ units: [], lessons: [], questionIds: [], answerOptions: [] }),
    );
    expect(plan.problems).toEqual([]);
    expect(plan.retiredLessons).toEqual([]);
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
});
