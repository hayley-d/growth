import type { NewQuestion, Question, QuestionChanges } from "@/domain/assessment/question";
import type { Repository } from "@/domain/common/repository";

export type QuestionRepository = Repository<Question, NewQuestion, QuestionChanges> & {
  listActiveByLessonId(lessonId: string): Promise<Question[]>;
  listActiveByLessonIds(lessonIds: readonly string[]): Promise<Question[]>;
  listByIds(ids: readonly string[]): Promise<Question[]>;
  listActiveGenerated(): Promise<Question[]>;
};
