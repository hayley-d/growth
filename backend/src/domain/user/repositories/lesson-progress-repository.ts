import type { Repository } from "@/domain/common/repository";
import type {
  LessonProgress,
  LessonProgressChanges,
  LessonProgressKey,
  NewLessonProgress,
} from "@/domain/user/lesson-progress";

export type LessonProgressRepository = Repository<
  LessonProgress,
  NewLessonProgress,
  LessonProgressChanges,
  LessonProgressKey
>;
