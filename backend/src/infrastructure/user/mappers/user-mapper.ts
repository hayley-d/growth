import type { ColourTheme, NewUser, User, UserChanges } from "@/domain/user/user";
import { ColourTheme as ColourThemeRow, type User as UserRow } from "@/generated/prisma/client";

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

export const toUser = (row: UserRow): User => ({
  id: row.id,
  firstName: row.firstName,
  lastName: row.lastName,
  email: row.email,
  passwordHash: row.passwordHash,
  learningStyleId: row.learningStyleId,
  codeLanguageId: row.codeLanguageId,
  textToSpeech: row.textToSpeech,
  colourTheme: toColourTheme(row.colourTheme),
  createdAt: row.createdAt,
  displayName: row.displayName,
  showOnLeaderboard: row.showOnLeaderboard,
});

export const toUserCreateData = (user: NewUser) => ({
  ...user,
  colourTheme: user.colourTheme === undefined ? undefined : toColourThemeRow(user.colourTheme),
});

export const toUserUpdateData = (changes: UserChanges) => ({
  ...changes,
  colourTheme:
    changes.colourTheme === undefined ? undefined : toColourThemeRow(changes.colourTheme),
});
