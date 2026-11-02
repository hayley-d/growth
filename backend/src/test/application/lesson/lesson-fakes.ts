import { requestContext } from "@/application/context/request-context";
import type { LessonAccessDependencies } from "@/application/lesson/lesson-access";
import type { Lesson } from "@/domain/course-content/lesson";
import type { LessonNote, LessonNoteKey } from "@/domain/user/lesson-note";
import type { ProgressStatus } from "@/domain/user/lesson-progress";

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
  },
  {
    id: "lesson-2",
    unitId: "unit-1",
    title: "Lesson two",
    summary: "Second",
    notePrompt: "What changed?",
    kind: "lesson",
    position: 2,
  },
  {
    id: "checkpoint-1",
    unitId: "unit-2",
    title: "Checkpoint",
    summary: "Third",
    notePrompt: null,
    kind: "checkpoint",
    position: 1,
  },
];

type AccessOptions = {
  progress?: Record<string, ProgressStatus>;
  passedLessonIds?: string[];
};

export const createAccessDependencies = ({
  progress = {},
  passedLessonIds = [],
}: AccessOptions = {}): LessonAccessDependencies => ({
  lessonRepository: {
    findById: async (id) => lessons.find((lesson) => lesson.id === id) ?? null,
    listAll: async () => lessons,
  },
  lessonProgressRepository: {
    findById: async ({ userId: progressUserId, lessonId }) => {
      const status = progress[lessonId];
      return status ? { userId: progressUserId, lessonId, status, completedAt: null } : null;
    },
  },
  assessmentAttemptRepository: {
    hasPassedForLesson: async (_userId, lessonId) => passedLessonIds.includes(lessonId),
  },
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
