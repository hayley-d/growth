import type {
  AttemptAnswer,
  AttemptAnswerChanges,
  NewAttemptAnswer,
} from "@/domain/assessment/attempt-answer";
import type { Repository } from "@/domain/common/repository";

export type AttemptAnswerRepository = Repository<
  AttemptAnswer,
  NewAttemptAnswer,
  AttemptAnswerChanges
>;
