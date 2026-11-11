import type { LessonRepository } from "@/domain/course-content/repositories/lesson-repository";
import { NotFoundError } from "@/domain/errors";
import type { LessonProgressRepository } from "@/domain/user/repositories/lesson-progress-repository";
import type { UserRepository } from "@/domain/user/repositories/user-repository";

type UnlockLessonsDependencies = {
  userRepository: Pick<UserRepository, "findByEmail">;
  lessonRepository: Pick<LessonRepository, "listAll">;
  lessonProgressRepository: Pick<LessonProgressRepository, "completeAll">;
};

export type UnlockLessonsInput = {
  email: string;
  count: number;
};

export type UnlockLessonsResult = {
  unlocked: number;
  total: number;
};

export const makeUnlockLessons =
  ({ userRepository, lessonRepository, lessonProgressRepository }: UnlockLessonsDependencies) =>
  async ({ email, count }: UnlockLessonsInput): Promise<UnlockLessonsResult> => {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new NotFoundError("No user has that email", { email });
    const lessons = await lessonRepository.listAll();
    const unlocked = Math.min(count, lessons.length);
    const lessonIds = lessons.slice(0, unlocked - 1).map((lesson) => lesson.id);
    if (lessonIds.length > 0) {
      await lessonProgressRepository.completeAll(user.id, lessonIds, new Date());
    }
    return { unlocked, total: lessons.length };
  };

export type UnlockLessons = ReturnType<typeof makeUnlockLessons>;
