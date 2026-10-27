export type CodeLanguage = {
  id: string;
  code: string;
  name: string;
};

export type NewCodeLanguage = {
  code: string;
  name: string;
};

export type CodeLanguageChanges = Partial<NewCodeLanguage>;
