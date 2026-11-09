import { requestContext } from "@/application/context/request-context";
import type { LessonAccessDependencies } from "@/application/lesson/lesson-access";
import type { Lesson } from "@/domain/course-content/lesson";
import type { LessonNote, LessonNoteKey } from "@/domain/user/lesson-note";
import type {
  LessonProgress,
  LessonProgressKey,
  ProgressStatus,
} from "@/domain/user/lesson-progress";

export const userId = "user-1";

export const lessons: Lesson[] = [
  {
    id: "lesson-1",
    unitId: "unit-1",
    title: "Lesson one",
    summary: "First",
    notePrompt: "Explain it in your own words",
    kind: "lesson",
    position: 1,
    objectives: [],
    isRetired: false,
  },
  {
    id: "lesson-2",
    unitId: "unit-1",
    title: "Lesson two",
    summary: "Second",
    notePrompt: "What changed?",
    kind: "lesson",
    position: 2,
    objectives: [],
    isRetired: false,
  },
  {
    id: "checkpoint-1",
    unitId: "unit-2",
    title: "Checkpoint",
    summary: "Third",
    notePrompt: null,
    kind: "checkpoint",
    position: 1,
    objectives: [],
    isRetired: false,
  },
  {
    id: "retired-1",
    unitId: "unit-1",
    title: "Retired lesson",
    summary: "Gone",
    notePrompt: null,
    kind: "lesson",
    position: -1,
    objectives: [],
    isRetired: true,
  },
];

export const createProgressRepository = (progress: Record<string, ProgressStatus> = {}) => {
  const stored = new Map<string, LessonProgress>(
    Object.entries(progress).map(([lessonId, status]) => [
      lessonId,
      { userId, lessonId, status, completedAt: null },
    ]),
  );
  return {
    stored,
    findById: async ({ lessonId }: LessonProgressKey) => stored.get(lessonId) ?? null,
    listByUserId: async () => [...stored.values()],
    start: async (key: LessonProgressKey) => {
      const row = stored.get(key.lessonId) ?? { ...key, status: "started", completedAt: null };
      stored.set(key.lessonId, row);
      return row;
    },
  };
};

export const createAccessDependencies = ({
  progress = {},
}: {
  progress?: Record<string, ProgressStatus>;
} = {}): LessonAccessDependencies => ({
  lessonRepository: {
    findById: async (id) => lessons.find((lesson) => lesson.id === id) ?? null,
    listAll: async () => lessons.filter((lesson) => !lesson.isRetired),
  },
  lessonProgressRepository: createProgressRepository(progress),
});

export const createLessonNoteRepository = (notes: LessonNote[] = []) => {
  const keyOf = (key: LessonNoteKey) => `${key.userId}:${key.lessonId}`;
  const stored = new Map(notes.map((note) => [keyOf(note), note]));
  return {
    stored,
    findById: async (key: LessonNoteKey) => stored.get(keyOf(key)) ?? null,
    create: async (note: { userId: string; lessonId: string; body: string }) => {
      const created = { ...note, updatedAt: new Date("2026-11-02T10:00:00.000Z") };
      stored.set(keyOf(note), created);
      return created;
    },
    update: async (key: LessonNoteKey, changes: { body?: string }) => {
      const existing = stored.get(keyOf(key));
      if (!existing) throw new Error("missing note");
      const updated = { ...existing, ...changes, updatedAt: new Date("2026-11-02T11:00:00.000Z") };
      stored.set(keyOf(key), updated);
      return updated;
    },
  };
};

export const asLearner = <Result>(callback: () => Result) =>
  requestContext.run({ requestId: "request-1", userId }, callback);
