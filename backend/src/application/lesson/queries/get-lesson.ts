import type { IdParam, LessonResponse } from "@shared/schemas";
import { buildSteps } from "@/application/lesson/build-steps";
import {
  getSignedInUserId,
  type LessonAccessDependencies,
  makeResolveLessonAccess,
} from "@/application/lesson/lesson-access";
import { toLessonResponse } from "@/application/lesson/lesson-mapper";
import type { Logger } from "@/application/logging/logger";
import type { ContentBlockRepository } from "@/domain/course-content/repositories/content-block-repository";
import type { UnitRepository } from "@/domain/course-content/repositories/unit-repository";
import { NotFoundError } from "@/domain/errors";
import type { UserProfileRepository } from "@/domain/user/repositories/user-profile-repository";

type GetLessonDependencies = LessonAccessDependencies & {
  unitRepository: Pick<UnitRepository, "findById">;
  contentBlockRepository: Pick<ContentBlockRepository, "listByLessonId">;
  userProfileRepository: Pick<UserProfileRepository, "findById">;
  logger: Logger;
};

export const makeGetLesson = (dependencies: GetLessonDependencies) => {
  const {
    lessonProgressRepository,
    unitRepository,
    contentBlockRepository,
    userProfileRepository,
    logger,
  } = dependencies;
  const resolveLessonAccess = makeResolveLessonAccess(dependencies);

  return async ({ id: lessonId }: IdParam): Promise<LessonResponse> => {
    const userId = getSignedInUserId();
    const { lesson, neighbours } = await resolveLessonAccess(userId, lessonId);
    const unit = await unitRepository.findById(lesson.unitId);
    if (!unit) throw new NotFoundError("Unit not found", { unitId: lesson.unitId });

    const [progress, profile, blocks] = await Promise.all([
      lessonProgressRepository.findById({ userId, lessonId }),
      userProfileRepository.findById(userId),
      contentBlockRepository.listByLessonId(lessonId),
    ]);

    return toLessonResponse({
      lesson,
      unit,
      completed: progress?.status === "completed",
      neighbours,
      steps: buildSteps(blocks, profile?.learningStyleId ?? null, logger),
    });
  };
};

export type GetLesson = ReturnType<typeof makeGetLesson>;
