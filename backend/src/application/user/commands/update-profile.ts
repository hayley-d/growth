import { type MeResponse, toMeResponse, type UpdateUserProfileRequest } from "@shared/schemas";
import { getSignedInUserId } from "@/application/lesson/lesson-access";
import type { CodeLanguageRepository } from "@/domain/course-content/repositories/code-language-repository";
import type { LearningStyleRepository } from "@/domain/course-content/repositories/learning-style-repository";
import { BadRequestError, NotFoundError } from "@/domain/errors";
import type { UserProfileRepository } from "@/domain/user/repositories/user-profile-repository";
import type { UserRepository } from "@/domain/user/repositories/user-repository";

type UpdateProfileDependencies = {
  userRepository: Pick<UserRepository, "findById">;
  userProfileRepository: Pick<UserProfileRepository, "update">;
  learningStyleRepository: Pick<LearningStyleRepository, "findById">;
  codeLanguageRepository: Pick<CodeLanguageRepository, "findById">;
};

export const makeUpdateProfile =
  ({
    userRepository,
    userProfileRepository,
    learningStyleRepository,
    codeLanguageRepository,
  }: UpdateProfileDependencies) =>
  async (changes: UpdateUserProfileRequest): Promise<MeResponse> => {
    const userId = getSignedInUserId();
    const { learningStyleId, codeLanguageId } = changes;
    if (learningStyleId && !(await learningStyleRepository.findById(learningStyleId))) {
      throw new BadRequestError("Learning style not found", { learningStyleId });
    }
    if (codeLanguageId && !(await codeLanguageRepository.findById(codeLanguageId))) {
      throw new BadRequestError("Code language not found", { codeLanguageId });
    }

    const user = await userRepository.findById(userId);
    if (!user) throw new NotFoundError("User not found", { userId });
    const profile = await userProfileRepository.update(userId, changes);
    return toMeResponse(user, profile);
  };

export type UpdateProfile = ReturnType<typeof makeUpdateProfile>;
