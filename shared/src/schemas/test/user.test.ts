import { describe, expect, it } from "vitest";

import {
  completeOnboardingRequestSchema,
  toMeResponse,
  updateUserProfileRequestSchema,
} from "@shared/schemas";

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

describe("completeOnboardingRequestSchema", () => {
  const request = {
    learningStyleId: "1b2c3d4e-5f60-4718-9a2b-3c4d5e6f7a80",
    codeLanguageId: "8d3c1f9e-4b1a-4c55-9d0e-2f6a7b8c9d01",
    showOnLeaderboard: false,
    textToSpeech: true,
  };

  it("accepts the four answers", () => {
    expect(completeOnboardingRequestSchema.parse(request)).toEqual(request);
  });

  it.each(Object.keys(request))("requires %s", (field) => {
    const { [field as keyof typeof request]: _left, ...rest } = request;
    expect(completeOnboardingRequestSchema.safeParse(rest).success).toBe(false);
  });

  it("drops fields onboarding doesn't set", () => {
    expect(
      completeOnboardingRequestSchema.parse({ ...request, onboardingComplete: false }),
    ).toEqual(request);
  });
});
