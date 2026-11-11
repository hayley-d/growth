import { type CompleteOnboardingRequest, type MeResponse, toMeResponse } from "@shared/schemas";
import { getSignedInUserId } from "@/application/lesson/lesson-access";
import { NotFoundError } from "@/domain/errors";
import type { UserProfileRepository } from "@/domain/user/repositories/user-profile-repository";
import type { UserRepository } from "@/domain/user/repositories/user-repository";

type CompleteOnboardingDependencies = {
  userRepository: Pick<UserRepository, "findById">;
  userProfileRepository: Pick<UserProfileRepository, "update">;
};

export const makeCompleteOnboarding =
  ({ userRepository, userProfileRepository }: CompleteOnboardingDependencies) =>
  async (answers: CompleteOnboardingRequest): Promise<MeResponse> => {
    const userId = getSignedInUserId();
    const user = await userRepository.findById(userId);
    if (!user) throw new NotFoundError("User not found", { userId });
    const profile = await userProfileRepository.update(userId, {
      ...answers,
      onboardingComplete: true,
    });
    return toMeResponse(user, profile);
  };

export type CompleteOnboarding = ReturnType<typeof makeCompleteOnboarding>;
