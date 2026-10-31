export type CodeLineKey = {
  codeSnippetId: string;
  stepKey: string;
};

export type CodeLine = {
  codeSnippetId: string;
  stepKey: string;
  lineNumber: number;
};

export type NewCodeLine = {
  codeSnippetId: string;
  stepKey: string;
  lineNumber: number;
};

export type CodeLineChanges = Partial<Omit<NewCodeLine, "codeSnippetId" | "stepKey">>;
