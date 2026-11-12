import { dirname } from "node:path";

import type { BloomsLevel, QuestionType } from "@/domain/assessment/question";
import type { LessonKind } from "@/domain/course-content/lesson";
import type { TreeMode } from "@/domain/course-content/unit";
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
import type {
  GeneratedQuestionData,
  WrittenQuestionData,
} from "@/infrastructure/course-content/content/content-schema";

export type UnitRow = {
  id: string;
  title: string;
  position: number;
  treeMode: TreeMode;
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

export type QuestionSource = {
  file: string;
  key: string;
};

export type ContentRows = QuestionRows & {
  units: UnitRow[];
  lessons: LessonRow[];
  questionSources: Map<string, QuestionSource>;
};

const writtenOptions = (question: WrittenQuestionData) => {
  if (question.type === "multiple_choice") return question.options;
  if (question.type === "text") {
    return question.accepted.map((accepted) => ({ ...accepted, isCorrect: true }));
  }
  return [];
};

const baseRow = (
  lessonKey: string,
  question: WrittenQuestionData | GeneratedQuestionData,
): Pick<
  QuestionRow,
  "id" | "lessonId" | "reviewLessonId" | "type" | "difficulty" | "bloomsLevel"
> => ({
  id: questionId(lessonKey, question.key),
  lessonId: lessonId(lessonKey),
  reviewLessonId: lessonId(question.reviewLesson),
  type: question.type,
  difficulty: question.difficulty,
  bloomsLevel: question.bloomsLevel,
});

const lessonQuestionRows = (lesson: CheckedLesson): QuestionRows => {
  const lessonKey = lesson.data.key;

  const written = lesson.questions.map((question) => {
    const base = baseRow(lessonKey, question);
    const { id } = base;
    const row: QuestionRow = {
      ...base,
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
    ...baseRow(lessonKey, question),
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
      treeMode: unit.treeMode,
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
    questionSources: new Map(
      content.lessons.flatMap((lesson) => {
        const source = (file: string) => (question: { key: string }) =>
          [
            questionId(lesson.data.key, question.key),
            { file: `${dirname(lesson.file)}/${file}`, key: question.key },
          ] as const;
        return [
          ...lesson.questions.map(source("questions.ts")),
          ...lesson.generated.map(source("generated.ts")),
        ];
      }),
    ),
  };
};
