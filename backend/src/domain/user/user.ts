export type ColourTheme = "default" | "high-contrast" | "okabe-ito";

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  learningStyleId: string;
  codeLanguageId: string;
  textToSpeech: boolean;
  colourTheme: ColourTheme;
  createdAt: Date;
  displayName: string;
  showOnLeaderboard: boolean;
};

export type NewUser = {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  learningStyleId: string;
  codeLanguageId: string;
  textToSpeech?: boolean;
  colourTheme?: ColourTheme;
  displayName: string;
  showOnLeaderboard?: boolean;
};

export type UserChanges = Partial<NewUser>;
