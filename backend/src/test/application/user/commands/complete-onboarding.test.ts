import { describe, expect, it, vi } from "vitest";

import { requestContext } from "@/application/context/request-context";
import { makeCompleteOnboarding } from "@/application/user/commands/complete-onboarding";
import { BadRequestError, UnauthorizedError } from "@/domain/errors";
import type { User } from "@/domain/user/user";
import type { UserProfile, UserProfileChanges } from "@/domain/user/user-profile";

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

const answers = {
  learningStyleId: "1b2c3d4e-5f60-4718-9a2b-3c4d5e6f7a80",
  codeLanguageId: "8d3c1f9e-4b1a-4c55-9d0e-2f6a7b8c9d01",
  showOnLeaderboard: false,
  textToSpeech: true,
};

const createCompleteOnboarding = () => {
  const profile: UserProfile = {
    userId,
    textToSpeech: false,
    colourTheme: "okabe-ito",
    showOnLeaderboard: true,
    onboardingComplete: false,
    learningStyleId: null,
    codeLanguageId: null,
  };
  const update = vi.fn(async (_key: string, changes: UserProfileChanges) =>
    Object.assign(profile, changes),
  );
  const completeOnboarding = makeCompleteOnboarding({
    userRepository: { findById: async (id) => (id === userId ? user : null) },
    userProfileRepository: { update },
  });
  return { completeOnboarding, profile, update };
};

const asLearner = <Result>(callback: () => Result) =>
  requestContext.run({ requestId: "request-1", userId }, callback);

describe("makeCompleteOnboarding", () => {
  it("saves the four answers and onboardingComplete in one write and returns the me body", async () => {
    const { completeOnboarding, update } = createCompleteOnboarding();

    const response = await asLearner(() => completeOnboarding(answers));

    expect(update).toHaveBeenCalledTimes(1);
    expect(update).toHaveBeenCalledWith(userId, { ...answers, onboardingComplete: true });
    expect(response).toEqual({
      data: {
        user: { email: "ada@example.com", emailVerified: false, displayName: "Ada" },
        profile: { ...answers, colourTheme: "okabe-ito", onboardingComplete: true },
      },
    });
  });

  it("overwrites the answers when onboarding is completed again", async () => {
    const { completeOnboarding, profile } = createCompleteOnboarding();
    const otherStyle = "2b2c3d4e-5f60-4718-9a2b-3c4d5e6f7a80";

    await asLearner(() => completeOnboarding(answers));
    await asLearner(() =>
      completeOnboarding({ ...answers, learningStyleId: otherStyle, textToSpeech: false }),
    );

    expect(profile).toMatchObject({
      learningStyleId: otherStyle,
      textToSpeech: false,
      onboardingComplete: true,
    });
  });

  it("passes on a 400 for an id that doesn't exist", async () => {
    const { completeOnboarding, update } = createCompleteOnboarding();
    update.mockRejectedValueOnce(new BadRequestError("A related record does not exist"));

    await expect(asLearner(() => completeOnboarding(answers))).rejects.toBeInstanceOf(
      BadRequestError,
    );
  });

  it("rejects a signed out request without writing", async () => {
    const { completeOnboarding, update } = createCompleteOnboarding();

    await expect(
      requestContext.run({ requestId: "request-1" }, () => completeOnboarding(answers)),
    ).rejects.toBeInstanceOf(UnauthorizedError);
    expect(update).not.toHaveBeenCalled();
  });
});
