export type LessonNote = {
  userId: string;
  lessonId: string;
  body: string;
  updatedAt: Date;
};

export type NewLessonNote = {
  userId: string;
  lessonId: string;
  body: string;
};

export type LessonNoteChanges = Partial<Pick<NewLessonNote, "body">>;

export type LessonNoteKey = {
  userId: string;
  lessonId: string;
};
