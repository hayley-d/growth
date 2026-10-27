export type ColourTheme = "default" | "high-contrast" | "okabe-ito";

export type UserProfile = {
  userId: string;
  textToSpeech: boolean;
  colourTheme: ColourTheme;
  showOnLeaderboard: boolean;
  learningStyleId: string | null;
  codeLanguageId: string | null;
};

export type NewUserProfile = {
  learningStyleId?: string;
  codeLanguageId?: string;
  textToSpeech?: boolean;
  colourTheme?: ColourTheme;
  showOnLeaderboard?: boolean;
};

export type UserProfileChanges = Partial<NewUserProfile>;
