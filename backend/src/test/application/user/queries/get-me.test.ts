import { describe, expect, it } from "vitest";

import { requestContext } from "@/application/context/request-context";
import { makeGetMe } from "@/application/user/queries/get-me";
import { NotFoundError, UnauthorizedError } from "@/domain/errors";
import type { User } from "@/domain/user/user";
import type { UserProfile } from "@/domain/user/user-profile";

const userId = "user-1";

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

const profile: UserProfile = {
  userId,
  textToSpeech: true,
  colourTheme: "high-contrast",
  showOnLeaderboard: false,
  onboardingComplete: false,
  learningStyleId: null,
  codeLanguageId: null,
};

const createGetMe = (savedProfile: UserProfile | null = profile) =>
  makeGetMe({
    userRepository: { findById: async (id) => (id === userId ? user : null) },
    userProfileRepository: { findById: async (id) => (id === userId ? savedProfile : null) },
  });

const asLearner = <Result>(callback: () => Result) =>
  requestContext.run({ requestId: "request-1", userId }, callback);

describe("makeGetMe", () => {
  it("returns the signed in learner and their profile", async () => {
    const response = await asLearner(() => createGetMe()());
    expect(response).toEqual({
      data: {
        user: { email: "ada@example.com", emailVerified: false, displayName: "Ada" },
        profile: {
          codeLanguageId: null,
          colourTheme: "high-contrast",
          learningStyleId: null,
          onboardingComplete: false,
          showOnLeaderboard: false,
          textToSpeech: true,
        },
      },
    });
  });

  it("returns not found when the profile is missing", async () => {
    await expect(asLearner(() => createGetMe(null)())).rejects.toBeInstanceOf(NotFoundError);
  });

  it("rejects a signed out request", async () => {
    await expect(
      requestContext.run({ requestId: "request-1" }, () => createGetMe()()),
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });
});
