export type ProgressStatus = "locked" | "started" | "completed";

export type LessonProgressKey = {
  userId: string;
  lessonId: string;
};

export type LessonProgress = {
  userId: string;
  lessonId: string;
  status: ProgressStatus;
  completedAt: Date | null;
};

export type NewLessonProgress = {
  userId: string;
  lessonId: string;
  status?: ProgressStatus;
  completedAt?: Date | null;
};

export type LessonProgressChanges = Partial<Omit<NewLessonProgress, "userId" | "lessonId">>;
