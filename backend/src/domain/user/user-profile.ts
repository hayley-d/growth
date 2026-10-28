export type ColourTheme = "default" | "high-contrast" | "okabe-ito";

export type UserProfile = {
  userId: string;
  textToSpeech: boolean;
  colourTheme: ColourTheme;
  showOnLeaderboard: boolean;
  onboardingComplete: boolean;
  learningStyleId: string | null;
  codeLanguageId: string | null;
};

export type NewUserProfile = {
  userId: string;
  learningStyleId?: string | null;
  codeLanguageId?: string | null;
  textToSpeech?: boolean;
  colourTheme?: ColourTheme;
  showOnLeaderboard?: boolean;
  onboardingComplete?: boolean;
};

export type UserProfileChanges = Partial<Omit<NewUserProfile, "userId">>;
