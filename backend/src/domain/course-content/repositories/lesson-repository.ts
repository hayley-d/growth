import type { Repository } from "@/domain/common/repository";
import type { Lesson, LessonChanges, NewLesson } from "@/domain/course-content/lesson";

export type LessonRepository = Repository<Lesson, NewLesson, LessonChanges> & {
  findByUnitIdAndPosition(unitId: string, position: number): Promise<Lesson | null>;
};
