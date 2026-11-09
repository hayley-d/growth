import { type MeResponse, toMeResponse } from "@shared/schemas";
import { getSignedInUserId } from "@/application/lesson/lesson-access";
import { NotFoundError } from "@/domain/errors";
import type { UserProfileRepository } from "@/domain/user/repositories/user-profile-repository";
import type { UserRepository } from "@/domain/user/repositories/user-repository";

type GetMeDependencies = {
  userRepository: Pick<UserRepository, "findById">;
  userProfileRepository: Pick<UserProfileRepository, "findById">;
};

export const makeGetMe =
  ({ userRepository, userProfileRepository }: GetMeDependencies) =>
  async (): Promise<MeResponse> => {
    const userId = getSignedInUserId();
    const [user, profile] = await Promise.all([
      userRepository.findById(userId),
      userProfileRepository.findById(userId),
    ]);
    if (!user || !profile) throw new NotFoundError("User not found", { userId });
    return toMeResponse(user, profile);
  };

export type GetMe = ReturnType<typeof makeGetMe>;
