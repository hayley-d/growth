export type LessonKind = "lesson" | "checkpoint";

export type Lesson = {
  id: string;
  unitId: string;
  title: string;
  summary: string;
  notePrompt: string | null;
  kind: LessonKind;
  position: number;
  objectives: string[];
  isRetired: boolean;
};

export type NewLesson = {
  unitId: string;
  title: string;
  summary: string;
  notePrompt?: string | null;
  kind: LessonKind;
  position: number;
  objectives?: string[];
  isRetired?: boolean;
};

export type LessonChanges = Partial<NewLesson>;
