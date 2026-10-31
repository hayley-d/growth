export type CodeSnippet = {
  id: string;
  algorithmId: string;
  codeLanguageId: string;
  source: string;
};

export type NewCodeSnippet = {
  algorithmId: string;
  codeLanguageId: string;
  source: string;
};

export type CodeSnippetChanges = Partial<NewCodeSnippet>;
