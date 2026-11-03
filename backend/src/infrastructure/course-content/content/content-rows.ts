import { dirname } from "node:path";

import type { BloomsLevel, QuestionType } from "@/domain/assessment/question";
import type { LessonKind } from "@/domain/course-content/lesson";
import type {
  CheckedContent,
  CheckedLesson,
} from "@/infrastructure/course-content/content/check-content";
import {
  answerOptionId,
  lessonId,
  questionId,
  unitId,
} from "@/infrastructure/course-content/content/content-id";
import type { WrittenQuestionData } from "@/infrastructure/course-content/content/content-schema";

export type UnitRow = {
  id: string;
  title: string;
  position: number;
};

export type LessonRow = {
  id: string;
  unitId: string;
  title: string;
  summary: string;
  notePrompt: string | null;
  kind: LessonKind;
  position: number;
  objectives: string[];
};

export type QuestionRow = {
  id: string;
  lessonId: string;
  reviewLessonId: string;
  type: QuestionType;
  difficulty: number;
  bloomsLevel: BloomsLevel;
  prompt: string | null;
  generatorKey: string | null;
  generatorOptions: unknown | null;
  explanation: string;
  tree: string | null;
  answer: unknown | null;
};

export type AnswerOptionRow = {
  id: string;
  questionId: string;
  text: string;
  isCorrect: boolean;
};

export type HintRow = {
  questionId: string;
  text: string;
  position: number;
};

export type QuestionRows = {
  questions: QuestionRow[];
  answerOptions: AnswerOptionRow[];
  hints: HintRow[];
};

export type ContentRows = QuestionRows & {
  units: UnitRow[];
  lessons: LessonRow[];
  questionFiles: Map<string, string>;
};

const writtenOptions = (question: WrittenQuestionData) => {
  if (question.type === "multiple_choice") return question.options;
  if (question.type === "text") {
    return question.accepted.map((accepted) => ({ ...accepted, isCorrect: true }));
  }
  return [];
};

const lessonQuestionRows = (lesson: CheckedLesson): QuestionRows => {
  const lessonKey = lesson.data.key;
  const owningLessonId = lessonId(lessonKey);

  const written = lesson.questions.map((question) => {
    const id = questionId(lessonKey, question.key);
    const row: QuestionRow = {
      id,
      lessonId: owningLessonId,
      reviewLessonId: lessonId(question.reviewLesson),
      type: question.type,
      difficulty: question.difficulty,
      bloomsLevel: question.bloomsLevel,
      prompt: question.prompt,
      generatorKey: null,
      generatorOptions: null,
      explanation: question.explanation,
      tree: question.tree ?? null,
      answer: "answer" in question ? question.answer : null,
    };
    return {
      row,
      answerOptions: writtenOptions(question).map((option) => ({
        id: answerOptionId(lessonKey, question.key, option.key),
        questionId: id,
        text: option.text,
        isCorrect: option.isCorrect,
      })),
      hints: question.hints.map((text, index) => ({ questionId: id, text, position: index + 1 })),
    };
  });

  const generated: QuestionRow[] = lesson.generated.map((question) => ({
    id: questionId(lessonKey, question.key),
    lessonId: owningLessonId,
    reviewLessonId: lessonId(question.reviewLesson),
    type: question.type,
    difficulty: question.difficulty,
    bloomsLevel: question.bloomsLevel,
    prompt: null,
    generatorKey: question.generatorKey,
    generatorOptions: question.generatorOptions ?? null,
    explanation: "",
    tree: null,
    answer: null,
  }));

  return {
    questions: [...written.map((question) => question.row), ...generated],
    answerOptions: written.flatMap((question) => question.answerOptions),
    hints: written.flatMap((question) => question.hints),
  };
};

export const toContentRows = (content: CheckedContent): ContentRows => {
  const questionRows = content.lessons.map(lessonQuestionRows);
  return {
    units: content.units.map((unit) => ({
      id: unitId(unit.key),
      title: unit.title,
      position: unit.position,
    })),
    lessons: content.lessons.map(({ data }) => ({
      id: lessonId(data.key),
      unitId: unitId(data.unit),
      title: data.title,
      summary: data.summary,
      notePrompt: data.notePrompt ?? null,
      kind: data.kind,
      position: data.position,
      objectives: data.objectives,
    })),
    questions: questionRows.flatMap((rows) => rows.questions),
    answerOptions: questionRows.flatMap((rows) => rows.answerOptions),
    hints: questionRows.flatMap((rows) => rows.hints),
    questionFiles: new Map(
      content.lessons.flatMap((lesson) =>
        lesson.questions.map((question) => [
          questionId(lesson.data.key, question.key),
          `${dirname(lesson.file)}/questions.ts`,
        ]),
      ),
    ),
  };
};
