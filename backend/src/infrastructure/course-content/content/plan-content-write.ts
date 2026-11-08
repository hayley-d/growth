import { isDeepStrictEqual } from "node:util";

import type {
  CheckedContent,
  ContentProblem,
} from "@/infrastructure/course-content/content/check-content";
import type {
  AnswerOptionRow,
  ContentRows,
  QuestionRow,
} from "@/infrastructure/course-content/content/content-rows";
import { learningStyleNames } from "@/infrastructure/course-content/content/content-schema";
import { groupBy } from "@/infrastructure/course-content/content/group-by";

export type ContentSnapshot = {
  units: { id: string; title: string }[];
  lessons: { id: string; unitId: string; position: number; isRetired: boolean }[];
  questions: (QuestionRow & { isRetired: boolean; answered: boolean })[];
  answerOptions: (AnswerOptionRow & { answered: boolean })[];
};

export type RetiredLesson = {
  id: string;
  position: number;
};

export type ContentWritePlan = {
  problems: ContentProblem[];
  retiredLessons: RetiredLesson[];
  retiredQuestionIds: string[];
  newQuestions: QuestionRow[];
  changedQuestions: QuestionRow[];
  deletedAnswerOptionIds: string[];
  newAnswerOptions: AnswerOptionRow[];
  changedAnswerOptions: AnswerOptionRow[];
};

export type Lookups = {
  learningStyleIds: Map<string, string>;
  codeLanguageIds: Map<string, string>;
  algorithmIds: Map<string, string>;
};

const unitsFile = "units.ts";

const questionsFile = "questions.ts";

export const requireId = (ids: ReadonlyMap<string, string>, key: string) => {
  const id = ids.get(key);
  if (id === undefined) throw new Error(`No id for "${key}". checkLookups should have caught it`);
  return id;
};

export const checkLookups = (content: CheckedContent, lookups: Lookups): ContentProblem[] => {
  const missing = (file: string, kind: string, name: string) => ({
    file,
    message: `${kind} "${name}" isn't in the database. Run the seed first`,
  });
  const problems: ContentProblem[] = [];
  for (const lesson of content.lessons) {
    for (const block of lesson.blocks) {
      if (block.style && !lookups.learningStyleIds.has(learningStyleNames[block.style])) {
        problems.push(missing(lesson.file, "Learning style", learningStyleNames[block.style]));
      }
    }
  }
  for (const snippet of content.snippets) {
    if (!lookups.algorithmIds.has(snippet.algorithm)) {
      problems.push(missing(snippet.file, "Algorithm", snippet.algorithm));
    }
    if (!lookups.codeLanguageIds.has(snippet.language)) {
      problems.push(missing(snippet.file, "Code language", snippet.language));
    }
  }
  return problems;
};

const retiredOrder = (
  first: ContentSnapshot["lessons"][number],
  second: ContentSnapshot["lessons"][number],
) => {
  if (first.isRetired !== second.isRetired) return first.isRetired ? -1 : 1;
  return first.isRetired ? second.position - first.position : first.position - second.position;
};

const retireLessons = (snapshot: ContentSnapshot, liveLessonIds: ReadonlySet<string>) => {
  const leaving = snapshot.lessons.filter((lesson) => !liveLessonIds.has(lesson.id));
  return [...groupBy(leaving, (lesson) => lesson.unitId).values()].flatMap((lessons) =>
    lessons.sort(retiredOrder).map((lesson, index) => ({ id: lesson.id, position: -(index + 1) })),
  );
};

const sameFields = <Row extends { id: string }>(row: Row, existing: Row) =>
  (Object.keys(row) as (keyof Row)[]).every((field) =>
    isDeepStrictEqual(row[field], existing[field]),
  );

const splitRows = <Row extends { id: string }, Existing extends Row>(
  rows: readonly Row[],
  existingById: ReadonlyMap<string, Existing>,
  isUnchanged: (row: Row, existing: Existing) => boolean,
) => ({
  created: rows.filter((row) => !existingById.has(row.id)),
  changed: rows.filter((row) => {
    const existing = existingById.get(row.id);
    return existing !== undefined && !isUnchanged(row, existing);
  }),
});

export const planContentWrite = (
  rows: ContentRows,
  snapshot: ContentSnapshot,
): ContentWritePlan => {
  const problems: ContentProblem[] = [];
  const fileOf = (questionId: string) =>
    rows.questionSources.get(questionId)?.file ?? questionsFile;

  const unitIds = new Set(rows.units.map((unit) => unit.id));
  for (const unit of snapshot.units.filter((candidate) => !unitIds.has(candidate.id))) {
    problems.push({
      file: unitsFile,
      message: `Unit "${unit.title}" is in the database but not in units.ts. The loader never removes a unit, so put it back`,
    });
  }

  const existingQuestions = new Map(snapshot.questions.map((question) => [question.id, question]));
  for (const question of rows.questions) {
    const existing = existingQuestions.get(question.id);
    if (existing?.answered && existing.type !== question.type) {
      problems.push({
        file: fileOf(question.id),
        message: `Question "${rows.questionSources.get(question.id)?.key ?? question.id}" was answered as a ${existing.type} question and can't become a ${question.type} question. Retire it and add a new one with a new key instead`,
      });
    }
  }

  const questionIds = new Set(rows.questions.map((question) => question.id));
  const existingOptions = new Map(snapshot.answerOptions.map((option) => [option.id, option]));
  const answerOptionIds = new Set(rows.answerOptions.map((option) => option.id));
  const removedOptions = snapshot.answerOptions.filter(
    (option) => questionIds.has(option.questionId) && !answerOptionIds.has(option.id),
  );
  for (const option of removedOptions.filter((candidate) => candidate.answered)) {
    problems.push({
      file: fileOf(option.questionId),
      message: `An answer option learners have answered ("${option.text}") was removed. Retire the question and add a new one with a new key instead`,
    });
  }
  for (const option of rows.answerOptions) {
    const existing = existingOptions.get(option.id);
    if (existing?.answered && existing.text !== option.text) {
      problems.push({
        file: fileOf(option.questionId),
        message: `An answer option learners have answered ("${existing.text}") was changed to "${option.text}". Retire the question and add a new one with a new key instead`,
      });
    }
  }

  const questions = splitRows(
    rows.questions,
    existingQuestions,
    (row, existing) => !existing.isRetired && sameFields(row, existing),
  );
  const answerOptions = splitRows(rows.answerOptions, existingOptions, sameFields);

  return {
    problems,
    retiredLessons: retireLessons(snapshot, new Set(rows.lessons.map((lesson) => lesson.id))),
    retiredQuestionIds: snapshot.questions
      .filter((question) => !questionIds.has(question.id) && !question.isRetired)
      .map((question) => question.id),
    newQuestions: questions.created,
    changedQuestions: questions.changed,
    deletedAnswerOptionIds: removedOptions
      .filter((option) => !option.answered)
      .map((option) => option.id),
    newAnswerOptions: answerOptions.created,
    changedAnswerOptions: answerOptions.changed,
  };
};
