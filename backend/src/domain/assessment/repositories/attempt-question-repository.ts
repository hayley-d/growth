import type {
  AttemptQuestion,
  AttemptQuestionChanges,
  NewAttemptQuestion,
} from "@/domain/assessment/attempt-question";
import type { Repository } from "@/domain/common/repository";

export type AttemptQuestionRepository = Repository<
  AttemptQuestion,
  NewAttemptQuestion,
  AttemptQuestionChanges
> & {
  listByAttemptId(assessmentAttemptId: string): Promise<AttemptQuestion[]>;
  takeHint(id: string, hintsUsed: number): Promise<boolean>;
};
