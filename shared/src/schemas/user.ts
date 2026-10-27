import { z } from "zod";

export const colourThemeSchema = z.enum(["default", "high-contrast", "okabe-ito"]);

export type ColourTheme = z.infer<typeof colourThemeSchema>;

export const userResponseSchema = z.object({
  id: z.uuid(),
  firstName: z.string(),
  lastName: z.string(),
  displayName: z.string(),
  email: z.email(),
  learningStyleId: z.uuid(),
  codeLanguageId: z.uuid(),
  textToSpeech: z.boolean(),
  colourTheme: colourThemeSchema,
  showOnLeaderboard: z.boolean(),
  createdAt: z.iso.datetime(),
});

export type UserResponse = z.infer<typeof userResponseSchema>;

const userFieldsSchema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  displayName: z.string().trim().min(1),
  email: z.string().trim().toLowerCase().pipe(z.email()),
  learningStyleId: z.uuid(),
  codeLanguageId: z.uuid(),
  textToSpeech: z.boolean(),
  colourTheme: colourThemeSchema,
  showOnLeaderboard: z.boolean(),
});

export const createUserRequestSchema = userFieldsSchema.extend({
  password: z.string().min(8),
  textToSpeech: z.boolean().default(false),
  colourTheme: colourThemeSchema.default("default"),
  showOnLeaderboard: z.boolean().default(true),
});

export type CreateUserRequest = z.infer<typeof createUserRequestSchema>;

export const updateUserRequestSchema = userFieldsSchema.partial();

export type UpdateUserRequest = z.infer<typeof updateUserRequestSchema>;
