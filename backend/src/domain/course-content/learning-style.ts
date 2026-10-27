export type LearningStyle = {
  id: string;
  name: string;
  description: string;
};

export type NewLearningStyle = {
  name: string;
  description: string;
};

export type LearningStyleChanges = Partial<NewLearningStyle>;
