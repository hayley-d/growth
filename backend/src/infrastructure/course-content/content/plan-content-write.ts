import type { ContentProblem } from "@/infrastructure/course-content/content/check-content";
import type { ContentRows } from "@/infrastructure/course-content/content/content-rows";

export type ContentSnapshot = {
  units: { id: string; title: string }[];
  lessons: { id: string; unitId: string; position: number; isRetired: boolean }[];
  questionIds: string[];
  answerOptions: { id: string; questionId: string; text: string; answered: boolean }[];
};

export type RetiredLesson = {
  id: string;
  position: number;
};

export type ContentWritePlan = {
  problems: ContentProblem[];
  retiredLessons: RetiredLesson[];
  retiredQuestionIds: string[];
  deletedAnswerOptionIds: string[];
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
  const unitIds = [...new Set(leaving.map((lesson) => lesson.unitId))];
  return unitIds.flatMap((unitId) =>
    leaving
      .filter((lesson) => lesson.unitId === unitId)
      .sort(retiredOrder)
      .map((lesson, index) => ({ id: lesson.id, position: -(index + 1) })),
  );
};

export const planContentWrite = (
  rows: ContentRows,
  snapshot: ContentSnapshot,
): ContentWritePlan => {
  const problems: ContentProblem[] = [];

  const unitIds = new Set(rows.units.map((unit) => unit.id));
  for (const unit of snapshot.units.filter((candidate) => !unitIds.has(candidate.id))) {
    problems.push({
      file: "units.ts",
      message: `Unit "${unit.title}" is in the database but not in units.ts. The loader never removes a unit, so put it back`,
    });
  }

  const questionIds = new Set(rows.questions.map((question) => question.id));
  const answerOptionIds = new Set(rows.answerOptions.map((option) => option.id));
  const removedOptions = snapshot.answerOptions.filter(
    (option) => questionIds.has(option.questionId) && !answerOptionIds.has(option.id),
  );
  for (const option of removedOptions.filter((candidate) => candidate.answered)) {
    problems.push({
      file: rows.questionFiles.get(option.questionId) ?? "questions.ts",
      message: `An answer option learners have answered ("${option.text}") was removed. Retire the question and add a new one with a new key instead`,
    });
  }

  return {
    problems,
    retiredLessons: retireLessons(snapshot, new Set(rows.lessons.map((lesson) => lesson.id))),
    retiredQuestionIds: snapshot.questionIds.filter((id) => !questionIds.has(id)),
    deletedAnswerOptionIds: removedOptions
      .filter((option) => !option.answered)
      .map((option) => option.id),
  };
};
