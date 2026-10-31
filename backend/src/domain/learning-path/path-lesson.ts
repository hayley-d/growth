export type PathLesson = {
  readonly id: string;
  readonly unitId: string;
};

export type LessonStatus = "completed" | "current" | "locked";

export type LessonWithStatus<Lesson extends PathLesson = PathLesson> = {
  readonly lesson: Lesson;
  readonly status: LessonStatus;
};
