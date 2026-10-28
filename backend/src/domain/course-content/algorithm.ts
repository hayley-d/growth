export type Algorithm = {
  id: string;
  code: string;
  name: string;
};

export type NewAlgorithm = {
  code: string;
  name: string;
};

export type AlgorithmChanges = Partial<NewAlgorithm>;
