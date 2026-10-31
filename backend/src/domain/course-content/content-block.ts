export type ContentBlockType = "text" | "diagram" | "animation" | "playground" | "code_trace";

export type ContentBlock = {
  id: string;
  lessonId: string;
  learningStyleId: string | null;
  type: ContentBlockType;
  body: unknown;
  transcript: string;
  position: number;
};

export type NewContentBlock = {
  lessonId: string;
  learningStyleId?: string | null;
  type: ContentBlockType;
  body: unknown;
  transcript: string;
  position: number;
};

export type ContentBlockChanges = Partial<NewContentBlock>;
