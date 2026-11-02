import type { LessonNoteResponse, LessonResponse, LessonStep } from "@shared/schemas";
import type { Lesson } from "@/domain/course-content/lesson";
import type { Unit } from "@/domain/course-content/unit";
import type { LessonNeighbours } from "@/domain/learning-path/lesson-access";
import type { LessonNote } from "@/domain/user/lesson-note";

export const toLessonNoteResponse = (
  lessonId: string,
  note: LessonNote | null,
): LessonNoteResponse => ({
  data: {
    lessonId,
    body: note?.body ?? "",
    updatedAt: note?.updatedAt.toISOString() ?? null,
  },
});

type LessonResponseSource = {
  lesson: Lesson;
  unit: Unit;
  completed: boolean;
  neighbours: LessonNeighbours;
  steps: LessonStep[];
};

export const toLessonResponse = ({
  lesson,
  unit,
  completed,
  neighbours,
  steps,
}: LessonResponseSource): LessonResponse => ({
  data: {
    lesson: {
      id: lesson.id,
      title: lesson.title,
      summary: lesson.summary,
      kind: lesson.kind,
      position: lesson.position,
      notePrompt: lesson.notePrompt,
    },
    unit: { id: unit.id, title: unit.title, position: unit.position },
    status: completed ? "completed" : "current",
    previousLessonId: neighbours.previousLessonId,
    nextLessonId: neighbours.nextLessonId,
    steps,
  },
});
