import { vi } from "vitest";

import type { LearnerAnswer } from "@shared/schemas";
import { requestContext } from "@/application/context/request-context";
import type { AnswerOption } from "@/domain/assessment/answer-option";
import type { AssessmentAttempt } from "@/domain/assessment/assessment-attempt";
import type { AttemptAnswer } from "@/domain/assessment/attempt-answer";
import type { AttemptQuestion, AttemptQuestionDraft } from "@/domain/assessment/attempt-question";
import type { Hint } from "@/domain/assessment/hint";
import type { Question } from "@/domain/assessment/question";
import type { RecordAnswerInput } from "@/domain/assessment/repositories/attempt-answer-repository";
import type { Lesson } from "@/domain/course-content/lesson";
import type { UserMastery, UserMasteryKey } from "@/domain/user/user-mastery";

export const learnerId = "user-1";

export const asUser = <Result>(userId: string, callback: () => Result) =>
  requestContext.run({ requestId: "request-1", userId }, callback);

export const asLearner = <Result>(callback: () => Result) => asUser(learnerId, callback);

const makeLesson = (
  id: string,
  unitId: string,
  position: number,
  kind: Lesson["kind"],
): Lesson => ({
  id,
  unitId,
  title: `Title of ${id}`,
  summary: "",
  notePrompt: null,
  kind,
  position,
  objectives: [],
  isRetired: false,
});

export const lessons: Lesson[] = [
  makeLesson("lesson-a", "unit-1", 1, "lesson"),
  makeLesson("lesson-b", "unit-1", 2, "lesson"),
  makeLesson("checkpoint-1", "unit-1", 3, "checkpoint"),
  makeLesson("lesson-c", "unit-2", 1, "lesson"),
  makeLesson("final-1", "unit-2", 2, "checkpoint"),
];

const makeQuestion = (
  overrides: Partial<Question> & Pick<Question, "id" | "lessonId" | "type">,
) => ({
  reviewLessonId: "lesson-a",
  difficulty: 2,
  bloomsLevel: "apply" as const,
  prompt: `Prompt of ${overrides.id}`,
  generatorKey: null,
  generatorOptions: null,
  explanation: `Explanation of ${overrides.id}`,
  tree: null,
  answer: null,
  isRetired: false,
  ...overrides,
});

export const questions: Question[] = [
  makeQuestion({ id: "q-choice", lessonId: "lesson-a", type: "multiple_choice" }),
  makeQuestion({ id: "q-text", lessonId: "lesson-a", type: "text" }),
  makeQuestion({
    id: "q-generated",
    lessonId: "lesson-a",
    type: "text",
    prompt: null,
    explanation: "",
    difficulty: 3,
    generatorKey: "traversal-order",
    generatorOptions: { order: "preorder" },
  }),
  makeQuestion({
    id: "q-tree",
    lessonId: "lesson-b",
    type: "build_tree",
    reviewLessonId: "lesson-b",
    tree: "2,#,#",
    answer: { type: "build_tree", tree: "2,1,#,#,3,#,#" },
  }),
  makeQuestion({
    id: "q-rotation",
    lessonId: "lesson-c",
    type: "predict_rotation",
    reviewLessonId: "lesson-c",
    answer: { type: "predict_rotation", rotation: "left", pivotKey: 10 },
  }),
];

export const answerOptions: AnswerOption[] = [
  { id: "option-right", questionId: "q-choice", text: "Right", isCorrect: true },
  { id: "option-wrong", questionId: "q-choice", text: "Wrong", isCorrect: false },
  { id: "accepted-1", questionId: "q-text", text: "Pre-order", isCorrect: true },
  { id: "accepted-2", questionId: "q-text", text: "root first", isCorrect: true },
];

export const hints: Hint[] = questions
  .filter((question) => question.generatorKey === null)
  .flatMap((question) => [
    { id: `${question.id}-hint-1`, questionId: question.id, text: "Hint one", position: 1 },
    { id: `${question.id}-hint-2`, questionId: question.id, text: "Hint two", position: 2 },
  ]);

export const writtenAnswers: Record<string, LearnerAnswer> = {
  "q-choice": { type: "multiple_choice", optionId: "option-right" },
  "q-text": { type: "text", text: "  PRE-order " },
  "q-tree": { type: "build_tree", tree: "2,1,#,#,3,#,#" },
  "q-rotation": { type: "predict_rotation", rotation: "left", pivotKey: 10 },
};

export const createRandom = (seed = 7) => {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
};

type WorldOptions = {
  questions?: Question[];
  mastery?: UserMastery[];
  lessons?: Lesson[];
};

export const createWorld = (options: WorldOptions = {}) => {
  const lessonRows = options.lessons ?? lessons;
  const questionRows = options.questions ?? questions;
  const attempts: AssessmentAttempt[] = [];
  const attemptQuestions: AttemptQuestion[] = [];
  const attemptAnswers: AttemptAnswer[] = [];
  const masteryRows = new Map<string, UserMastery>(
    (options.mastery ?? []).map((row) => [`${row.userId}:${row.lessonId}`, row]),
  );
  let counter = 0;
  const nextId = (prefix: string) => `${prefix}-${++counter}`;
  const masteryKey = ({ userId, lessonId }: UserMasteryKey) => `${userId}:${lessonId}`;

  type NewAttempt = Partial<AssessmentAttempt> & Pick<AssessmentAttempt, "userId" | "kind">;

  const insertAttempt = (entity: NewAttempt): AssessmentAttempt => {
    const attempt: AssessmentAttempt = {
      id: nextId("attempt"),
      lessonId: null,
      dailyChallengeId: null,
      practiceTopic: null,
      score: 0,
      passed: false,
      points: 0,
      startedAt: new Date("2026-11-09T10:00:00.000Z"),
      finishedAt: null,
      ...entity,
    };
    attempts.push(attempt);
    return attempt;
  };

  const lessonRepository = {
    findById: async (id: string) => lessonRows.find((lesson) => lesson.id === id) ?? null,
    listAll: async () => lessonRows.filter((lesson) => !lesson.isRetired),
  };

  const assessmentAttemptRepository = {
    findById: async (id: string) => attempts.find((attempt) => attempt.id === id) ?? null,
    findUnfinishedByLesson: async (userId: string, lessonId: string) =>
      attempts.find(
        (attempt) =>
          attempt.userId === userId && attempt.lessonId === lessonId && attempt.finishedAt === null,
      ) ?? null,
    findUnfinishedPractice: async (userId: string) =>
      attempts.find(
        (attempt) =>
          attempt.userId === userId && attempt.kind === "practice" && attempt.finishedAt === null,
      ) ?? null,
    create: async (entity: NewAttempt) => insertAttempt(entity),
    createWithQuestions: vi.fn(async (entity: NewAttempt, drafts: AttemptQuestionDraft[]) => {
      const attempt = insertAttempt(entity);
      for (const draft of drafts) {
        attemptQuestions.push({
          id: nextId("attempt-question"),
          assessmentAttemptId: attempt.id,
          seed: null,
          generatedQuestion: null,
          hintsUsed: 0,
          ...draft,
        });
      }
      return attempt;
    }),
    update: async (id: string, changes: Partial<AssessmentAttempt>) => {
      const index = attempts.findIndex((attempt) => attempt.id === id);
      const updated = { ...(attempts[index] as AssessmentAttempt), ...changes };
      attempts[index] = updated;
      return updated;
    },
  };

  const attemptQuestionRepository = {
    listByAttemptId: async (assessmentAttemptId: string) =>
      attemptQuestions
        .filter((row) => row.assessmentAttemptId === assessmentAttemptId)
        .sort((first, second) => first.position - second.position)
        .map((row) => ({ ...row })),
    create: async (
      entity: Omit<AttemptQuestion, "id" | "seed" | "generatedQuestion" | "hintsUsed"> &
        Partial<AttemptQuestion>,
    ) => {
      const created: AttemptQuestion = {
        id: nextId("attempt-question"),
        seed: null,
        generatedQuestion: null,
        hintsUsed: 0,
        ...entity,
      };
      attemptQuestions.push(created);
      return { ...created };
    },
    takeHint: vi.fn(async (id: string, hintsUsed: number) => {
      const row = attemptQuestions.find((candidate) => candidate.id === id);
      if (!row || row.hintsUsed !== hintsUsed) return false;
      row.hintsUsed += 1;
      return true;
    }),
  };

  const attemptAnswerRepository = {
    listByAttemptId: async (assessmentAttemptId: string) =>
      attemptAnswers
        .filter((row) => row.assessmentAttemptId === assessmentAttemptId)
        .map((row) => ({ ...row })),
    countByUserAndLesson: async (userId: string, lessonId: string) =>
      attemptAnswers.filter((row) => {
        const attempt = attempts.find((candidate) => candidate.id === row.assessmentAttemptId);
        const question = questionRows.find((candidate) => candidate.id === row.questionId);
        return (
          attempt?.userId === userId &&
          attempt.kind !== "practice" &&
          question?.lessonId === lessonId
        );
      }).length,
    recordAnswer: vi.fn(async ({ answer, mastery }: RecordAnswerInput) => {
      const created: AttemptAnswer = {
        id: nextId("answer"),
        answerOptionId: null,
        seed: null,
        generatedQuestion: null,
        hintsUsed: 0,
        ...answer,
      };
      attemptAnswers.push(created);
      if (mastery) masteryRows.set(masteryKey(mastery), { ...mastery, updatedAt: new Date() });
      return created;
    }),
  };

  const questionRepository = {
    listByIds: async (ids: readonly string[]) =>
      questionRows.filter((question) => ids.includes(question.id)),
    listActiveByLessonIds: async (lessonIds: readonly string[]) =>
      questionRows.filter(
        (question) => lessonIds.includes(question.lessonId) && !question.isRetired,
      ),
  };

  const answerOptionRepository = {
    listByQuestionId: async (questionId: string) =>
      answerOptions.filter((option) => option.questionId === questionId),
  };

  const hintRepository = {
    listByQuestionId: async (questionId: string) =>
      hints.filter((hint) => hint.questionId === questionId),
  };

  const userMasteryRepository = {
    findById: async (key: UserMasteryKey) => masteryRows.get(masteryKey(key)) ?? null,
  };

  const completeLesson = vi.fn().mockResolvedValue(undefined);
  const logger = { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() };

  const correctAnswerOf = (attemptQuestionId: string): LearnerAnswer => {
    const row = attemptQuestions.find((candidate) => candidate.id === attemptQuestionId);
    if (!row) throw new Error("unknown attempt question");
    const generated = row.generatedQuestion as { answer: LearnerAnswer } | null;
    return generated ? generated.answer : (writtenAnswers[row.questionId] as LearnerAnswer);
  };

  return {
    attempts,
    attemptQuestions,
    attemptAnswers,
    masteryRows,
    completeLesson,
    logger,
    correctAnswerOf,
    dependencies: {
      assessmentAttemptRepository,
      attemptQuestionRepository,
      attemptAnswerRepository,
      questionRepository,
      answerOptionRepository,
      hintRepository,
      userMasteryRepository,
      lessonRepository,
      completeLesson,
      logger,
    },
  };
};

export type World = ReturnType<typeof createWorld>;
