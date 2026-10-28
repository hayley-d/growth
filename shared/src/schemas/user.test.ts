import { describe, expect, it } from "vitest";

import { toMeResponse, updateUserProfileRequestSchema } from "@shared/schemas/user";

describe("updateUserProfileRequestSchema", () => {
  it("leaves out fields that weren't sent", () => {
    expect(updateUserProfileRequestSchema.parse({ textToSpeech: true })).toEqual({
      textToSpeech: true,
    });
  });

  it("rejects a colour theme that isn't one", () => {
    expect(updateUserProfileRequestSchema.safeParse({ colourTheme: "neon" }).success).toBe(false);
  });
});

describe("toMeResponse", () => {
  const user = {
    id: "user-1",
    name: "Ada",
    email: "ada@example.com",
    emailVerified: false,
    role: "student",
    banned: false,
  };
  const profile = {
    userId: "user-1",
    codeLanguageId: null,
    colourTheme: "high-contrast" as const,
    learningStyleId: "1b2c3d4e-5f60-4718-9a2b-3c4d5e6f7a80",
    showOnLeaderboard: true,
    onboardingComplete: false,
    textToSpeech: false,
  };

  it("returns the user's name as the display name, with only the fields the app uses", () => {
    expect(toMeResponse(user, profile)).toEqual({
      data: {
        user: { email: "ada@example.com", emailVerified: false, displayName: "Ada" },
        profile: {
          codeLanguageId: null,
          colourTheme: "high-contrast",
          learningStyleId: "1b2c3d4e-5f60-4718-9a2b-3c4d5e6f7a80",
          showOnLeaderboard: true,
          onboardingComplete: false,
          textToSpeech: false,
        },
      },
    });
  });

  it("rejects a colour theme the frontend doesn't know", () => {
    expect(() =>
      toMeResponse(user, { ...profile, colourTheme: "high_contrast" as "high-contrast" }),
    ).toThrow();
  });
});
