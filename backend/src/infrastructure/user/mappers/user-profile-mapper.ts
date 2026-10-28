import type {
  ColourTheme,
  NewUserProfile,
  UserProfile,
  UserProfileChanges,
} from "@/domain/user/user-profile";
import {
  ColourTheme as ColourThemeRow,
  type UserProfile as UserProfileRow,
} from "@/generated/prisma/client";

const colourThemeByRow: Record<ColourThemeRow, ColourTheme> = {
  [ColourThemeRow.default]: "default",
  [ColourThemeRow.high_contrast]: "high-contrast",
  [ColourThemeRow.okabe_ito]: "okabe-ito",
};

const rowByColourTheme: Record<ColourTheme, ColourThemeRow> = {
  default: ColourThemeRow.default,
  "high-contrast": ColourThemeRow.high_contrast,
  "okabe-ito": ColourThemeRow.okabe_ito,
};

export const toColourTheme = (row: ColourThemeRow): ColourTheme => colourThemeByRow[row];

export const toColourThemeRow = (colourTheme: ColourTheme): ColourThemeRow =>
  rowByColourTheme[colourTheme];

export const toUserProfile = (row: UserProfileRow): UserProfile => ({
  userId: row.userId,
  textToSpeech: row.textToSpeech,
  colourTheme: toColourTheme(row.colourTheme),
  showOnLeaderboard: row.showOnLeaderboard,
  onboardingComplete: row.onboardingComplete,
  learningStyleId: row.learningStyleId,
  codeLanguageId: row.codeLanguageId,
});

export const toUserProfileCreateData = (profile: NewUserProfile) => ({
  ...profile,
  colourTheme:
    profile.colourTheme === undefined ? undefined : toColourThemeRow(profile.colourTheme),
});

export const toUserProfileUpdateData = (changes: UserProfileChanges) => ({
  ...changes,
  colourTheme:
    changes.colourTheme === undefined ? undefined : toColourThemeRow(changes.colourTheme),
});
