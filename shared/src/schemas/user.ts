import { z } from "zod";

export const colourThemeSchema = z.enum(["default", "high-contrast", "okabe-ito"]);

export type ColourTheme = z.infer<typeof colourThemeSchema>;

const userProfileFieldsSchema = z.object({
  learningStyleId: z.uuid(),
  codeLanguageId: z.uuid(),
  textToSpeech: z.boolean(),
  colourTheme: colourThemeSchema,
  showOnLeaderboard: z.boolean(),
});

export const updateUserProfileRequestSchema = userProfileFieldsSchema.partial();

export type UpdateUserProfileRequest = z.infer<typeof updateUserProfileRequestSchema>;

const meProfileSchema = z.object({
  codeLanguageId: z.uuid().nullable(),
  colourTheme: colourThemeSchema,
  learningStyleId: z.uuid().nullable(),
  onboardingComplete: z.boolean(),
  showOnLeaderboard: z.boolean(),
  textToSpeech: z.boolean(),
});

export const meResponseSchema = z.object({
  data: z.object({
    user: z.object({
      email: z.email(),
      emailVerified: z.boolean(),
      displayName: z.string(),
    }),
    profile: meProfileSchema,
  }),
});

export type MeResponse = z.infer<typeof meResponseSchema>;

export const meSourceSchema = z
  .object({
    user: z.object({
      email: z.email(),
      emailVerified: z.boolean(),
      name: z.string(),
    }),
    profile: meProfileSchema,
  })
  .transform(({ user, profile }) => ({
    data: {
      user: { email: user.email, emailVerified: user.emailVerified, displayName: user.name },
      profile,
    },
  }))
  .pipe(meResponseSchema);

export type MeSource = z.input<typeof meSourceSchema>;

export const toMeResponse = (user: MeSource["user"], profile: MeSource["profile"]): MeResponse =>
  meSourceSchema.parse({ user, profile });
