export type AnswerOption = {
  id: string;
  questionId: string;
  text: string;
  isCorrect: boolean;
};

export type NewAnswerOption = {
  questionId: string;
  text: string;
  isCorrect: boolean;
};

export type AnswerOptionChanges = Partial<NewAnswerOption>;
