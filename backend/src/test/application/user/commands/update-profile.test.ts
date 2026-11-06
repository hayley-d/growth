import { describe, expect, it } from "vitest";

import { requestContext } from "@/application/context/request-context";
import { makeUpdateProfile } from "@/application/user/commands/update-profile";
import { BadRequestError, UnauthorizedError } from "@/domain/errors";
import type { User } from "@/domain/user/user";
import type { UserProfile, UserProfileChanges } from "@/domain/user/user-profile";

const userId = "user-1";
const learningStyleId = "1b2c3d4e-5f60-4718-9a2b-3c4d5e6f7a80";
const codeLanguageId = "8d3c1f9e-4b1a-4c55-9d0e-2f6a7b8c9d01";
const unknownId = "00000000-0000-4000-8000-000000000000";

const user: User = {
  id: userId,
  name: "Ada",
  email: "ada@example.com",
  emailVerified: false,
  image: null,
  role: "student",
  banned: false,
  banReason: null,
  banExpires: null,
  createdAt: new Date("2026-11-01T10:00:00.000Z"),
  updatedAt: new Date("2026-11-01T10:00:00.000Z"),
};

const createUpdateProfile = () => {
  const profile: UserProfile = {
    userId,
    textToSpeech: false,
    colourTheme: "default",
    showOnLeaderboard: true,
    onboardingComplete: true,
    learningStyleId: null,
    codeLanguageId: null,
  };
  const updateProfile = makeUpdateProfile({
    userRepository: { findById: async (id) => (id === userId ? user : null) },
    userProfileRepository: {
      update: async (_key, changes: UserProfileChanges) => Object.assign(profile, changes),
    },
    learningStyleRepository: {
      findById: async (id) =>
        id === learningStyleId ? { id, name: "Visual", description: "Pictures" } : null,
    },
    codeLanguageRepository: {
      findById: async (id) => (id === codeLanguageId ? { id, code: "java", name: "Java" } : null),
    },
  });
  return { updateProfile, profile };
};

const asLearner = <Result>(callback: () => Result) =>
  requestContext.run({ requestId: "request-1", userId }, callback);

describe("makeUpdateProfile", () => {
  it("changes only the fields sent and returns the me body", async () => {
    const { updateProfile } = createUpdateProfile();
    const response = await asLearner(() =>
      updateProfile({ colourTheme: "okabe-ito", learningStyleId, codeLanguageId }),
    );
    expect(response).toEqual({
      data: {
        user: { email: "ada@example.com", emailVerified: false, displayName: "Ada" },
        profile: {
          codeLanguageId,
          colourTheme: "okabe-ito",
          learningStyleId,
          onboardingComplete: true,
          showOnLeaderboard: true,
          textToSpeech: false,
        },
      },
    });
  });

  it("leaves the profile as it was when nothing is sent", async () => {
    const { updateProfile, profile } = createUpdateProfile();
    const before = { ...profile };
    await asLearner(() => updateProfile({}));
    expect(profile).toEqual(before);
  });

  it.each([
    ["learning style", { learningStyleId: unknownId }],
    ["code language", { codeLanguageId: unknownId }],
  ])("rejects a %s that doesn't exist and changes nothing", async (_name, changes) => {
    const { updateProfile, profile } = createUpdateProfile();
    const before = { ...profile };
    await expect(
      asLearner(() => updateProfile({ ...changes, textToSpeech: true })),
    ).rejects.toBeInstanceOf(BadRequestError);
    expect(profile).toEqual(before);
  });

  it("rejects a signed out request", async () => {
    const { updateProfile } = createUpdateProfile();
    await expect(
      requestContext.run({ requestId: "request-1" }, () => updateProfile({ textToSpeech: true })),
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });
});
