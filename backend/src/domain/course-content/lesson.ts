export type LessonKind = "lesson" | "checkpoint";

export type Lesson = {
  id: string;
  unitId: string;
  title: string;
  summary: string;
  kind: LessonKind;
  position: number;
};

export type NewLesson = {
  unitId: string;
  title: string;
  summary: string;
  kind: LessonKind;
  position: number;
};

export type LessonChanges = Partial<NewLesson>;
