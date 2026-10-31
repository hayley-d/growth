export type Hint = {
  id: string;
  questionId: string;
  text: string;
  position: number;
};

export type NewHint = {
  questionId: string;
  text: string;
  position: number;
};

export type HintChanges = Partial<NewHint>;
