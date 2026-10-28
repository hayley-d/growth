export type QuestionType =
  | "multiple_choice"
  | "build_tree"
  | "order_nodes"
  | "predict_rotation"
  | "text";

export type BloomsLevel = "remember" | "understand" | "apply" | "analyse" | "evaluate" | "create";

export type Question = {
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
};

export type NewQuestion = {
  lessonId: string;
  reviewLessonId: string;
  type: QuestionType;
  difficulty: number;
  bloomsLevel: BloomsLevel;
  prompt?: string | null;
  generatorKey?: string | null;
  generatorOptions?: unknown | null;
  explanation: string;
};

export type QuestionChanges = Partial<NewQuestion>;
